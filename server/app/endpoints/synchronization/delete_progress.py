from domains.synchronization.service import (
    SynchronizationServicePort,
)
from endpoints.synchronization.synchronization_service import (
    get_sync_service_in_api_context,
)
from request_types import GenericAPIResponse
from utils.error_adapter import get_http_error
from context import current_user


class ProgressDeletionHandler:
    @property
    def sync_svc(self) -> SynchronizationServicePort:
        return get_sync_service_in_api_context()

    def handle(self, progress_key: str) -> GenericAPIResponse:
        try:
            result = self.sync_svc.delete_progress(
                progress_key=progress_key,
                user_key=current_user.get().key,
            )

            if not result.success:
                return GenericAPIResponse(success=False, message="Progress not found or could not be deleted")
            
            return GenericAPIResponse(success=True, message="Progress deleted successfully")
        except Exception as err:
            raise get_http_error(err)