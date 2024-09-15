import {
  getLocalRepositoryStub,
  getRemoteRepositoryStub,
  MockLocalRepository,
  MockRemoteRepository,
} from "@/repositories/stubs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { _getLibraryService } from "../library-service";
import { BASIC_SCENE, BASIC_STORY } from "@/repositories/stubs/data";

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
    });

    it("should not create story if JSON is malformed", async () => {
      const result = await libraryService.importFromJSON(`tutu${fileContent}`);
    });

    it("should not create story if format is invalid", async () => {
      const result = await libraryService.importFromJSON(
        JSON.stringify({ stories: ["tutu"] }),
      );
    });

    it("should not create scenes if story cannot be created");

    it("should not create scenes if story cannot be created");

    it("should work correctly if story already exists{");
  });

  // TODO: test other methods
});
