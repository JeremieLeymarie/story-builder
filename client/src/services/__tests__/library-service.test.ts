import {
  getLocalRepositoryStub,
  getRemoteRepositoryStub,
  MockLocalRepository,
  MockRemoteRepository,
} from "@/repositories/stubs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { _getLibraryService } from "../library-service";
import {
  BASIC_SCENE,
  BASIC_STORY,
  BASIC_STORY_PROGRESS,
  BASIC_USER,
} from "@/repositories/stubs/data";

describe("library-service", () => {
  let libraryService: ReturnType<typeof _getLibraryService>;
  let localRepository: MockLocalRepository;
  let remoteRepository: MockRemoteRepository;

  beforeEach(() => {
    localRepository = getLocalRepositoryStub();
    remoteRepository = getRemoteRepositoryStub();

    libraryService = _getLibraryService({
      localRepository,
      remoteRepository,
    });
  });

  describe("downloadStory", () => {
    it("should gracefully fail when offline", async () => {
      vi.spyOn(window.navigator, "onLine", "get").mockReturnValue(false);

      const result = await libraryService.downloadStory("tiptoptap");

      expect(result).toBeFalsy();
    });

    it("should download story from store", async () => {
      const result = await libraryService.downloadStory("tiptoptap");

      expect(remoteRepository.downloadStory).toHaveBeenCalledWith("tiptoptap");
      expect(localRepository.getStory).toHaveBeenCalledWith(BASIC_STORY.key);
      expect(localRepository.createStory).not.toHaveBeenCalled();
      expect(localRepository.createScenes).not.toHaveBeenCalled();
      expect(localRepository.createStoryProgress).toHaveBeenCalled();

      expect(result).toBeTruthy();
    });

    it("should create story if it doesn't exist", async () => {
      localRepository.getStory.mockReturnValueOnce(Promise.resolve(null));

      const result = await libraryService.downloadStory("tiptoptap");

      expect(localRepository.createStory).toHaveBeenCalledWith(BASIC_STORY);
      expect(localRepository.createScenes).toHaveBeenCalledWith([BASIC_SCENE]);
      expect(localRepository.createStoryProgress).toHaveBeenCalled();

      expect(result).toBeTruthy();
    });

    it("should fail if story is invalid", async () => {
      const getStorySpy = vi.spyOn(localRepository, "getStory");
      const downloadStorySpy = vi.spyOn(remoteRepository, "downloadStory");

      downloadStorySpy.mockResolvedValueOnce({ error: "Error" });

      const result = await libraryService.downloadStory("tiptoptap");

      expect(getStorySpy).not.toHaveBeenCalledWith();

      expect(result).toBeFalsy();
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
      const result = await libraryService.importFromJSON(fileContent);

      expect(localRepository.createStory).toHaveBeenCalledWith({
        status: "imported",
        originalStoryKey: "bloup",
        title: "The Great Journey To The Green River",
        description: "A wonderful epic tale through the world of Penthetir. ",
        image:
          "https://b2-backblaze-stackpath.b-cdn.net/2178699/c5jpvq_12e7c09178a6a75a5979d117f779bb07ff07f8f9.jpg",
        genres: ["adventure" as const, "fantasy" as const],
        creationDate: importedStory.creationDate,
        firstSceneKey: "skibidi",
      });
      expect(localRepository.createScene).toHaveBeenCalledOnce();
      expect(localRepository.updateScenes).toHaveBeenCalledOnce();
      expect(localRepository.createStoryProgress).toHaveBeenCalled();
      expect(result).toStrictEqual({ error: null });
    });

    it("should not create story if JSON is malformed", async () => {
      const result = await libraryService.importFromJSON(`tutu${fileContent}`);

      expect(result).toStrictEqual({ error: "Invalid JSON format" });
      expect(localRepository.createStory).not.toHaveBeenCalled();
    });

    it("should not create story if format is invalid", async () => {
      const result = await libraryService.importFromJSON(
        JSON.stringify({ plouf: ["tutu"] }),
      );

      expect(result).toStrictEqual({ error: "Story is required" });
      expect(localRepository.createStory).not.toHaveBeenCalled();
    });

    it("should not create scenes if story cannot be created", async () => {
      localRepository.createStory.mockResolvedValueOnce(null);

      const result = await libraryService.importFromJSON(fileContent);

      expect(result).toStrictEqual({ error: "Could not create story" });

      expect(localRepository.createStory).toHaveBeenCalled();
      expect(localRepository.createScene).not.toHaveBeenCalled();
      expect(localRepository.updateScenes).not.toHaveBeenCalled();
    });
  });

  describe("getLibrary", () => {
    it("should get all library data", async () => {
      const data = await libraryService.getLibrary();

      expect(localRepository.getUser).toHaveBeenCalled();
      expect(localRepository.getStoryProgresses).toHaveBeenCalledWith(
        BASIC_USER.key,
      );
      expect(localRepository.getStoriesByKeys).toHaveBeenCalledWith([
        BASIC_STORY_PROGRESS.storyKey,
      ]);
      expect(localRepository.getFinishedGameKeys).toHaveBeenCalled();

      expect(data).toStrictEqual({
        games: [BASIC_STORY],
        finishedGameKeys: ["key"],
      });
    });
  });

  describe("getLibraryDetail", () => {
    it("should retrieve details about a story", async () => {
      const data = await libraryService.getLibraryDetail("pouf");

      expect(localRepository.getStory).toHaveBeenCalledWith("pouf");
      expect(localRepository.getStoryProgress).toHaveBeenCalledWith("pouf");
      expect(localRepository.getScene).toHaveBeenCalledWith(
        BASIC_STORY_PROGRESS.currentSceneKey,
      );

      expect(data).toStrictEqual({
        story: BASIC_STORY,
        progress: BASIC_STORY_PROGRESS,
        lastScene: BASIC_SCENE,
      });
    });

    it("should return only story if there is no linked progress", async () => {
      localRepository.getStoryProgress.mockResolvedValueOnce(null);

      const data = await libraryService.getLibraryDetail("pouf");

      expect(localRepository.getScene).not.toHaveBeenCalledWith(
        BASIC_STORY_PROGRESS.currentSceneKey,
      );

      expect(data).toStrictEqual({
        story: BASIC_STORY,
        progress: null,
        lastScene: null,
      });
    });
  });
});
