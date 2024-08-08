import { RemoteRepositoryPort } from "./remote-repository-port";
import { client } from "@/lib/http-client/client";
import { adapter } from "@/lib/http-client/adapters";
import { components } from "@/lib/http-client/schema";
import { User } from "@/lib/storage/domain";

const UNKNOWN_ERROR = "Unknown API Error";

const parseError = (
  error:
    | {
        detail?: components["schemas"]["ValidationError"][];
      }
    | string,
) => {
  return typeof error === "string"
    ? error
    : error.detail?.[0]?.msg ?? UNKNOWN_ERROR;
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
        return { data: adapter.fromAPI.fullStory(response.data) };
      }
      return { error: parseError(response.error) };
    },

    login: async (usernameOrEmail, password) => {
      const response = await client.POST("/api/user/login", {
        body: { usernameOrEmail, password },
      });

      if (response.data) return response;

      return { error: parseError(response.error) };
    },

    register: async (user: User & { password: string }) => {
      const response = await client.POST("/api/user/register", {
        body: { ...user },
      });

      if (response.data) return response;

      return { error: parseError(response.error) };
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

      return { error: parseError(error) };
    },

    saveStoryProgresses: async (progresses, userKey) => {
      const { data, error } = await client.PUT("/api/save/progresses", {
        body: adapter.fromClient.storyProgresses(progresses, userKey),
      });

      if (data) return { data: progresses };

      return { error: parseError(error) };
    },

    saveStories: async (stories, scenes) => {
      const { data, error } = await client.PUT("/api/save/builder", {
        body: { stories: adapter.fromClient.stories(stories), scenes },
      });

      if (data) {
        return { data };
      }
      return { error: parseError(error) };
    },

    getSynchronizationData: async (userKey: string) => {
      const { data, error } = await client.GET("/api/load/{user_key}", {
        params: { path: { user_key: userKey } },
      });

      if (data)
        return {
          data: {
            builderGames: adapter.fromAPI.fullStories(data.builderGames ?? []),
            playerGames: adapter.fromAPI.fullStories(data.playerGames),
            storyProgresses: adapter.fromAPI.storyProgresses(
              data.storyProgresses,
            ),
          },
        };

      return { error: parseError(error) };
    },

    getSynchronizationData: async (userKey: string) => {
      const { data, error } = await client.GET("/api/synchronize/{user_key}", {
        params: { path: { user_key: userKey } },
      });

      if (data)
        return {
          data: adapter.fromAPI.synchronizationData(data),
        };

      return { error: parseError(error) };
    },
  };
};

export const getRemoteAPIRepository = () => {
  return _getRemoteAPIRepository(client);
};
