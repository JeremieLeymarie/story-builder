import {
  getLocalRepository,
  getRemoteAPIRepository,
  LocalRepositoryPort,
  RemoteRepositoryPort,
} from "@/repositories";
import { checkCanPerformSync, isOnline } from "./common/sync";
import { getGameService } from "./game-service";
import { getUserService } from "./user-service";
import { getBuilderService } from "./builder-service";
import { getLibraryService } from "./library-service";

const _getSyncService = ({
  remoteRepository,
  localRepository,
  builderService,
  gameService,
  libraryService,
  userService,
}: {
  remoteRepository: RemoteRepositoryPort;
  localRepository: LocalRepositoryPort;
  // TODO: use ports
  builderService: ReturnType<typeof getBuilderService>;
  gameService: ReturnType<typeof getGameService>;
  libraryService: ReturnType<typeof getLibraryService>;
  userService: ReturnType<typeof getUserService>;
}) => {
  return {
    // Load remote data into local data
    load: async () => {
      const user = await localRepository.getUser();

      if (!user) {
        throw new Error(
          "Impossible action: user must be logged in to load external state",
        );
      }

      const { canSync, error } = checkCanPerformSync(user);

      if (!canSync) {
        return { success: false, error };
      }

      const response = await remoteRepository.getSynchronizationData(user);

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
      const builderStories = await builderService.getAllBuilderData();
      const libraryStories = await libraryService.getAllLibraryData();
      const progresses = await gameService.getStoryProgresses();
      const user = await userService.getCurrentUser();

      if (!user) {
        return { success: false, cause: "User not logged in" };
      }

      if (!isOnline()) {
        return { success: false, cause: "Network unreachable" };
      }

      const [progressResponse, builderResponse] = await Promise.all([
        remoteRepository.saveStoryProgresses(progresses, user),
        remoteRepository.saveStories(
          [...builderStories.stories, ...libraryStories.stories],
          [...builderStories.scenes, ...libraryStories.scenes],
          user,
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
    libraryService: getLibraryService(),
  });
