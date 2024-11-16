from domains.synchronization_service import SynchronizationService
from domains.type_def import Story
from repositories.story_progress_repository import StoryProgressRepository
from repositories.story_repository import StoryRepository
from request_types import FullStoriesRequest, GenericAPIResponse
from utils.error_adapter import raise_http_error
from utils.errors import UnauthorizedException
from context import current_user


class BuilderStateSynchronization:

    def check_rights(self, stories: list[Story]) -> None:
        current_user_key = current_user.get().key

        for story in stories:
            if story.author is not None and story.author.key != current_user_key:
                raise UnauthorizedException()

    def handle(self, payload: FullStoriesRequest) -> GenericAPIResponse:
        try:
            SynchronizationService(
                story_repository=StoryRepository(),
                story_progress_repository=StoryProgressRepository(),
            ).save_builder_stories(payload.stories, payload.scenes)

            return GenericAPIResponse(success=True)

        except Exception as err:
            raise raise_http_error(err)
