import { getDexieBuilderSceneRepository } from "./domains/builder/builder-scene-repository";
import { _getBuilderService } from "./domains/builder/builder-service";
import { getDexieBuilderStoryRepository } from "./domains/builder/builder-story-repository";
import { getLayoutService } from "./domains/builder/layout-service";
import { getLocalRepository } from "./repositories";
import { getImportExportService } from "./services/common/import-export-service";

export const getBuilderService = () => {
  return _getBuilderService({
    localRepository: getLocalRepository(),
    layoutService: getLayoutService(),
    importExportService: getImportExportService(),
    storyRepository: getDexieBuilderStoryRepository(),
    sceneRepository: getDexieBuilderSceneRepository(),
  });
};
