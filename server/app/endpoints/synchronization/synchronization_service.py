from domains.synchronization.service import (
    SynchronizationService,
    SynchronizationServicePort,
)
from domains.synchronization.repositories.synchronization_repository import (
    MongoSynchronizationRepository,
)


def get_sync_service_in_api_context() -> SynchronizationServicePort:
    return SynchronizationService(repository=MongoSynchronizationRepository())
