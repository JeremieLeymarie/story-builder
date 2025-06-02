from domains.synchronization.service import (
    SynchronizationServicePort,
)
from endpoints.synchronization.synchronization_service import (
    get_sync_service_in_api_context,
)
from endpoints.synchronization.type_defs import StoryProgress
from request_types import GenericAPIResponse
from utils.errors import UnauthorizedException
from utils.error_adapter import raise_http_error
from context import current_user


class ProgressSynchronizationHandler:
    @property
    def sync_svc(self) -> SynchronizationServicePort:
        return get_sync_service_in_api_context()

    def check_rights(self, progresses: list[StoryProgress]) -> None:
        current_user_key = current_user.get().key

        for progress in progresses:
            if progress.user_key != current_user_key:
                raise UnauthorizedException()

    def handle(self, story_progresses: list[StoryProgress]) -> GenericAPIResponse:
        try:
            self.check_rights(story_progresses)
            self.sync_svc.save_progresses([sp.to_domain() for sp in story_progresses])

            return GenericAPIResponse(success=True)
        except Exception as err:
            raise raise_http_error(err)
