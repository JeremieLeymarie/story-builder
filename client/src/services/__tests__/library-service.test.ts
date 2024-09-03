import { LocalRepositoryPort, RemoteRepositoryPort } from "@/repositories";
import {
  getLocalRepositoryStub,
  getRemoteRepositoryStub,
} from "@/repositories/stubs";
import { beforeEach, describe, expect, it } from "vitest";
import { _getLibraryService } from "../library-service";

describe("library-service", () => {
  let libraryService: ReturnType<typeof _getLibraryService>;
  let localRepository: LocalRepositoryPort;
  let remoteRepository: RemoteRepositoryPort;

  beforeEach(() => {
    localRepository = getLocalRepositoryStub();
    remoteRepository = getRemoteRepositoryStub();

    libraryService = _getLibraryService({
      localRepository,
      remoteRepository,
    });
  });

  describe("importFromJSON", () => {
    const importedStory = {
      key: "bloup",
      title: "The Great Journey To The Green River",
      description: "A wonderful epic tale through the world of Penthetir. ",
      image:
        "https://b2-backblaze-stackpath.b-cdn.net/2178699/c5jpvq_12e7c09178a6a75a5979d117f779bb07ff07f8f9.jpg",
      status: "draft" as const,
      genres: ["adventure" as const, "fantasy" as const],
      creationDate: new Date(),
      firstSceneKey: "skibidi",
    };
    const importedScenes = [
      {
        key: "skibidi",
        storyKey: "bloup",
        title: "Your first scene",
        content: "This is a placeholder content for your first scene",
        actions: [
          {
            text: "An action that leads to a scene",
            sceneKey: "jMa8IEtNg8ZCAbZaRz-yU",
          },
          {
            text: "An action that leads to another scene",
          },
        ],
        builderParams: {
          position: {
            x: 0,
            y: 0,
          },
        },
      },
    ];
    const fileContent = JSON.stringify({
      story: importedStory,
      scenes: importedScenes,
    });

    it("should import story from JSON", async () => {
      const result = await builderService.importFromJSON(fileContent);

      const story = await localRepository.getStory("bloup");
      const scenes = await localRepository.getScenes("bloup");

      expect(result).toStrictEqual({ error: null });
      expect(story).toStrictEqual(importedStory);
      expect(scenes).toStrictEqual(importedScenes);
    });

    it("should not create story if JSON is malformed", async () => {
      const result = await builderService.importFromJSON(`tutu${fileContent}`);

      const story = await localRepository.getStory("bloup");
      const scenes = await localRepository.getScenes("bloup");

      expect(result).toStrictEqual({ error: "Invalid JSON format" });
      expect(story).toBeNull();
      expect(scenes).toStrictEqual([]);
    });

    it("should not create story if format is invalid", async () => {
      const result = await builderService.importFromJSON(
        JSON.stringify({ stories: ["tutu"] }),
      );

      const story = await localRepository.getStory("bloup");
      const scenes = await localRepository.getScenes("bloup");

      expect(result).toStrictEqual({ error: "Story is required" });
      expect(story).toBeNull();
      expect(scenes).toStrictEqual([]);
    });
  });
});
