from domains.synchronization_service import SynchronizationService
from repositories.story_progress_repository import StoryProgressRepository
from repositories.story_repository import StoryRepository
from request_types import SynchronizationResponse
from utils.error_adapter import raise_http_error


class SynchronizationDataHandler:
    def handle(self) -> SynchronizationResponse:

        try:
            synchronization_data = SynchronizationService(
                story_progress_repository=StoryProgressRepository(),
                story_repository=StoryRepository(),
            ).get_synchronization_data()
            return synchronization_data
        except Exception as err:
            raise raise_http_error(err)
