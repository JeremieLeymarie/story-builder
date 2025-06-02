from domains.synchronization.service import SynchronizationServicePort
from endpoints.synchronization.synchronization_service import (
    get_sync_service_in_api_context,
)
from endpoints.synchronization.type_defs import FullStoriesRequest, FullStory, Story
from request_types import GenericAPIResponse
from utils.error_adapter import raise_http_error
from utils.errors import UnauthorizedException
from context import current_user


class BuilderStateSynchronization:
    @property
    def sync_svc(self) -> SynchronizationServicePort:
        return get_sync_service_in_api_context()

    def check_rights(self, stories: list[Story]) -> None:
        current_user_key = current_user.get().key

        for story in stories:
            if story.author is not None and story.author.key != current_user_key:
                raise UnauthorizedException()

    def handle(self, payload: FullStoriesRequest) -> GenericAPIResponse:
        try:
            self.check_rights(stories=payload.stories)
            user_key = current_user.get().key

            full_stories = list[FullStory]()
            for story in payload.stories:
                full_stories.append(
                    FullStory.from_story_and_scenes(
                        story=story,
                        scenes=[
                            scene
                            for scene in payload.scenes
                            if scene.story_key == story.key
                        ],
                    )
                )

            self.sync_svc.save_stories(
                [full_story.to_domain() for full_story in full_stories],
                user_key=user_key,
            )
            return GenericAPIResponse(success=True)
        except Exception as err:
            raise raise_http_error(err)
