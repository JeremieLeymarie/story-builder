from domains.synchronization_service import SynchronizationService
from domains.type_def import StoryProgress
from repositories.story_progress_repository import StoryProgressRepository
from repositories.story_repository import StoryRepository
from request_types import GenericAPIResponse
from utils.errors import UnauthorizedException
from utils.error_adapter import raise_http_error
from context import current_user


class ProgressSynchronizationHandler:

    def check_rights(self, progresses: list[StoryProgress]) -> None:
        current_user_key = current_user.get().key

        for progress in progresses:
            if progress.userKey != current_user_key:
                raise UnauthorizedException()

    def handle(self, payload: list[StoryProgress]) -> GenericAPIResponse:
        try:
            self.check_rights(payload)

            SynchronizationService(
                story_progress_repository=StoryProgressRepository(),
                story_repository=StoryRepository(),
            ).save_progresses(payload)

            return GenericAPIResponse(success=True)
        except Exception as err:
            raise raise_http_error(err)
