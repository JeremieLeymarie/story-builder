import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useBuilderEdges } from "../use-builder-edges";
import { ReactFlowProvider, useReactFlow } from "@xyflow/react";
import { ReactNode } from "react";
import { getTestFactory } from "@/lib/testing/factory";
import { BuilderContextProvider } from "../use-builder-context";
import { getStubBuilderService } from "@/domains/builder/stubs/stub-builder-service";
import { Scene, Story } from "@/lib/storage/domain";
import { getStubCharacterService } from "@/domains/builder/stubs/stub-character-service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { scenesToNodesAndEdgesAdapter } from "@/builder/adapters";
import { BuilderEdge, BuilderNode } from "@/builder/types";

const factory = getTestFactory();
const builderSvc = getStubBuilderService();
const characterSvc = getStubCharacterService();

const useTestHook = () => {
  const edgeActions = useBuilderEdges();
  const rf = useReactFlow<BuilderNode, BuilderEdge>();

  return { edgeActions, rf };
};

const makeWrapper = ({ scenes, story }: { scenes: Scene[]; story: Story }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { networkMode: "offlineFirst" },
      mutations: {
        networkMode: "offlineFirst",
      },
    },
  });

  const [nodes, edges] = scenesToNodesAndEdgesAdapter({ scenes, story });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BuilderContextProvider
        story={story}
        scenes={scenes}
        builderService={builderSvc}
        characterService={characterSvc}
        refresh={() => Promise.resolve()}
      >
        <ReactFlowProvider initialNodes={nodes} initialEdges={edges}>
          {children}
        </ReactFlowProvider>
      </BuilderContextProvider>
    </QueryClientProvider>
  );
};

describe("use-builder-edges", () => {
  describe("on connect", () => {
    test("should connect edge", async () => {
      const sourceScene = factory.scene({
        key: "scene-1",
        actions: [
          {
            key: "action-a-key",
            type: "simple",
            text: "Action A",
            targets: [],
          },
          {
            key: "action-b-key",
            type: "simple",
            text: "Action B",
            targets: [],
          },
        ],
      });
      const targetScene = factory.scene({
        key: "scene-2",
        actions: [],
      });
      builderSvc.addSceneConnection.mockResolvedValueOnce({
        updatedScene: {
          ...sourceScene,
          actions: [
            {
              key: "action-a-key",
              type: "simple",
              text: "Action A",
              targets: [{ probability: 100, sceneKey: targetScene.key }],
            },
            {
              key: "action-b-key",
              type: "simple",
              text: "Action B",
              targets: [],
            },
          ],
        },
        addedConnection: true,
      });

      const { result } = renderHook(() => useTestHook(), {
        wrapper: makeWrapper({
          story: factory.story.builder(),
          scenes: [targetScene, sourceScene],
        }),
      });

      await act(async () => {
        await result.current.edgeActions.onConnect({
          source: sourceScene.key,
          sourceHandle: "action-a-key",
          target: targetScene.key,
          targetHandle: null,
        });
      });

      expect(builderSvc.addSceneConnection).toHaveBeenCalledWith({
        sourceSceneKey: sourceScene.key,
        actionKey: "action-a-key",
        destinationSceneKey: targetScene.key,
      });
    });
  });
});
