import { RemoteRepositoryPort } from "./remote-repository-port";
import { client } from "@/lib/http-client/client";
import { adapter } from "@/lib/http-client/adapters";
import { components } from "@/lib/http-client/schema";
import { User } from "@/lib/storage/domain";

const UNKNOWN_ERROR = "Unknown API Error";

const validationErrorToString = (error: {
  detail?: components["schemas"]["ValidationError"][];
}) => {
  return error.detail?.[0]?.msg ?? UNKNOWN_ERROR;
};

// TODO: handle other errors that validation errors
const _getRemoteAPIRepository = (
  _client: typeof client,
): RemoteRepositoryPort => {
  return {
    publishStory: async (scenes, story) => {
      const response = await _client.PUT("/api/store/publish", {
        body: { scenes, story: adapter.fromClient.story(story) },
      });

      if (response.data) {
        return { data: adapter.fromAPI.story(response.data) };
      }
      return { error: validationErrorToString(response.error) };
    },

    updateOrCreateStory: async (story) => {
      throw new Error("not implemented");
    },

    updateOrCreateFullStory: async (story, scenes) => {
      throw new Error("not implemented");
    },

    updateOrCreateScene: async (scene) => {
      throw new Error("not implemented");
    },

    updatePartialScene: async (key, scene) => {
      throw new Error("not implemented");
    },

    login: async (usernameOrEmail, password) => {
      const response = await client.POST("/api/user/login", {
        body: { usernameOrEmail, password },
      });

      if (response.data) return response;

      return { error: validationErrorToString(response.error) };
    },

    register: async (user: User & { password: string }) => {
      const response = await client.POST("/api/user/register", {
        body: { ...user },
      });

      if (response.data) return response;

      return { error: validationErrorToString(response.error) };
    },

    getStoreItems: async () => {
      const response = await client.GET("/api/store/load");

      if (response.data)
        return { data: adapter.fromAPI.stories(response.data) };

      return { error: response.error };
    },

    downloadStory: async (key) => {
      const { data, error } = await client.GET("/api/store/download/{key}", {
        params: { path: { key } },
      });

      if (data) return { data: adapter.fromAPI.fullStory(data) };

      return { error: validationErrorToString(error) };
    },

    saveStoryProgress: async (progress, userKey) => {
      const { data, error } = await client.PATCH("/api/synchronize/progress", {
        body: adapter.fromClient.storyProgress(progress, userKey),
      });

      if (data) return { data: progress };

      return { error: validationErrorToString(error) };
    },
  };
};

export const getRemoteAPIRepository = () => {
  return _getRemoteAPIRepository(client);
};
