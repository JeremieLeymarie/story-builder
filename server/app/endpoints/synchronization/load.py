from domains.synchronization.service import (
    SynchronizationServicePort,
)
from endpoints.synchronization.synchronization_service import (
    get_sync_service_in_api_context,
)
from endpoints.synchronization.type_defs import SynchronizationLoadResponse
from utils.error_adapter import raise_http_error


class SynchronizationDataHandler:
    @property
    def sync_svc(self) -> SynchronizationServicePort:
        return get_sync_service_in_api_context()

    def handle(self) -> SynchronizationLoadResponse:
        try:
            sync_data = self.sync_svc.get_synchronization_data()
            return SynchronizationLoadResponse.from_domain(
                builder_stories=sync_data.builder_stories,
                player_games=sync_data.games,
                story_progresses=sync_data.story_progresses,
            )
        except Exception as err:
            raise raise_http_error(err)
