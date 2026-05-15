import { getDexieBuilderSceneRepository } from "./domains/builder/builder-scene-repository";
import { _getBuilderService } from "./domains/builder/builder-service";
import { getDexieBuilderStoryRepository } from "./domains/builder/builder-story-repository";
import { getLayoutService } from "./domains/builder/layout-service";
import { getLocalRepository } from "./repositories";
import {
  _getImportService,
  getImportService,
} from "./services/common/import-service";

export const getBuilderService = () => {
  return _getBuilderService({
    localRepository: getLocalRepository(),
    layoutService: getLayoutService(),
    importService: getImportService(),
    storyRepository: getDexieBuilderStoryRepository(),
    sceneRepository: getDexieBuilderSceneRepository(),
  });
};
