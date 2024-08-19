import {
  getLocalRepository,
  getRemoteAPIRepository,
  LocalRepositoryPort,
  RemoteRepositoryPort,
} from "@/repositories";
import { checkCanPerformSync, isOnline } from "./common/sync";
import { getBuilderService } from "./builder";
import { getGameService } from "./game-service";
import { getUserService } from "./user-service";

const _getSyncService = ({
  remoteRepository,
  localRepository,
  builderService,
  gameService,
  userService,
}: {
  remoteRepository: RemoteRepositoryPort;
  localRepository: LocalRepositoryPort;
  // TODO: use ports
  builderService: ReturnType<typeof getBuilderService>;
  gameService: ReturnType<typeof getGameService>;
  userService: ReturnType<typeof getUserService>;
}) => {
  return {
    // Load remote data into local data
    load: async () => {
      const user = await localRepository.getUser();
      const { canSync, error } = checkCanPerformSync(user);

      if (!canSync) {
        return { success: false, error };
      }

      const response = await remoteRepository.getSynchronizationData(user!.key);

      if (!response.data) {
        return { success: false, error: response.error };
      }

      const { builderGames, playerGames, storyProgresses } = response.data;
      await Promise.all([
        builderService.loadBuilderState(
          builderGames.stories,
          builderGames.scenes,
        ),
        gameService.loadGamesState({
          progresses: storyProgresses,
          libraryStories: playerGames,
        }),
      ]);

      return { success: true, error: undefined };
    },

    // Save local data into remote data
    save: async () => {
      const builderStories = await builderService.getBuilderStoriesState();
      const progresses = await gameService.getStoryProgresses();
      const user = await userService.getCurrentUser();

      if (!user) {
        return { success: false, cause: "User not logged in" };
      }

      if (!isOnline()) {
        return { success: false, cause: "Network unreachable" };
      }

      const [progressResponse, builderResponse] = await Promise.all([
        remoteRepository.saveStoryProgresses(progresses, user.key),
        remoteRepository.saveStories(
          builderStories.stories ?? [],
          builderStories.scenes,
        ),
      ]);

      if (progressResponse.error) {
        return { success: false, cause: "Failed to save story progresses." };
      } else if (builderResponse.error) {
        return { success: false, cause: "Failed to save builder stories." };
      }

      return { success: true };
    },
  };
};

export const getSyncService = () =>
  _getSyncService({
    remoteRepository: getRemoteAPIRepository(),
    localRepository: getLocalRepository(),
    builderService: getBuilderService(),
    gameService: getGameService(),
    userService: getUserService(),
  });
