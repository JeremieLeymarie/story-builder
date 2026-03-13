import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useBuilderEdges } from "../use-builder-edges";
import { ReactFlowProvider, useReactFlow } from "@xyflow/react";
import { ReactNode } from "react";
import { getTestFactory } from "@/lib/testing/factory";
import { BuilderContextProvider } from "../use-builder-context";
import { getStubBuilderService } from "@/domains/builder/stubs/stub-builder-service";
import { Action, Scene } from "@/lib/storage/domain";
import { getStubCharacterService } from "@/domains/builder/stubs/stub-character-service";

const factory = getTestFactory();
const builderSvc = getStubBuilderService();
const characterSvc = getStubCharacterService();

const useTestHook = () => {
  const edgeActions = useBuilderEdges();
  const rf = useReactFlow();

  return { edgeActions, rf };
};

const makeWrapper = ({ scenes }: { scenes?: Scene[] } = {}) => {
  return ({ children }: { children: ReactNode }) => (
    <BuilderContextProvider
      story={factory.story.builder()}
      scenes={scenes ?? [factory.scene()]}
      builderService={builderSvc}
      characterService={characterSvc}
      refresh={() => Promise.resolve()}
    >
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </BuilderContextProvider>
  );
};

// TODO: make this test work
describe.skip("use-builder-edges", () => {
  describe("on connect", () => {
    test("should connect edge", async () => {
      const actions = [
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
      ] satisfies Action[];
      const sourceScene = factory.scene({
        actions,
      });
      const targetScene = factory.scene();
      builderSvc.addSceneConnection.mockResolvedValueOnce({
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
      });

      const { result } = renderHook(() => useTestHook(), {
        wrapper: makeWrapper(),
      });

      expect(result.current.rf.getEdges()).toHaveLength(0);

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

      await waitFor(() => expect(result.current.rf.getEdges()).toHaveLength(1));
      //   expect(result.current.edges[0]).toStrictEqual([]);
    });
  });
});
