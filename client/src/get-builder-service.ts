import { _getBuilderService } from "./domains/builder/builder-service";
import { _getLayoutService } from "./domains/builder/layout-service";
import { getLocalRepository } from "./repositories";

export const getBuilderService = () => {
  return _getBuilderService({
    localRepository: getLocalRepository(),
    layoutService: _getLayoutService(),
  });
};
