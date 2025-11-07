import { RemoteRepositoryPort } from "./remote-repository-port";
import { adapter } from "@/lib/http-client/adapters";
import { client } from "@/lib/http-client/client";
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
    : (error.detail?.[0]?.msg ?? UNKNOWN_ERROR);
};

const formatTokenHeader = (token?: string) => `Bearer ${token}`;

// TODO: handle other errors that validation errors
const _getRemoteAPIRepository = (
  _client: typeof client,
): RemoteRepositoryPort => {
  return {
    login: async (usernameOrEmail, password) => {
      const response = await _client.POST("/api/user/login", {
        body: { usernameOrEmail, password },
      });

      if (response.data) return response;

      return { error: parseError(response.error) };
    },

    register: async (user: User & { password: string }) => {
      const response = await _client.POST("/api/user/register", {
        body: { ...user },
      });

      if (response.data) return response;

      return { error: parseError(response.error) };
    },

    saveStoryProgresses: async (progresses, user) => {
      const { data, error } = await _client.PUT("/api/save/progresses", {
        body: adapter.fromClient.storyProgresses(progresses, user.key),
        params: { header: { authorization: formatTokenHeader(user.token) } },
      });

      if (data) return { data: progresses };

      return { error: parseError(error) };
    },

    saveStories: async (stories, scenes, user) => {
      const { data, error } = await _client.PUT("/api/save/stories", {
        body: {
          stories: adapter.fromClient.stories(stories, user.key),
          scenes,
        },
        params: { header: { authorization: formatTokenHeader(user.token) } },
      });

      if (data) {
        return { data };
      }
      return { error: parseError(error) };
    },

    getSynchronizationData: async (user) => {
      const { data, error } = await _client.GET("/api/load", {
        params: {
          header: { authorization: formatTokenHeader(user.token) },
        },
      });

      if (data)
        return {
          data: {
            builderGames: adapter.fromAPI.fullStories(
              data.builderStories ?? [],
            ),
            playerGames: adapter.fromAPI.fullStories(data.playerGames),
            storyProgresses: adapter.fromAPI.storyProgresses(
              data.storyProgresses,
            ),
          },
        };

      return { error: parseError(error) };
    },

    deleteStoryProgress: async (progressKey, user) => {
      try {
        const response = await fetch(`/api/progress/${progressKey}`, {
          method: "DELETE",
          headers: {
            Authorization: formatTokenHeader(user.token),
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          return { data };
        } else {
          const error = await response.text();
          return { error: parseError(error) };
        }
      } catch (_error) {
        return { error: parseError(UNKNOWN_ERROR) };
      }
    },
  };
};

export const getRemoteAPIRepository = () => {
  return _getRemoteAPIRepository(client);
};
