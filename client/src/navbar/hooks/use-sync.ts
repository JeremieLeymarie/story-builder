import { getSyncService } from "@/domains/synchronization/sync-service";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export type SynchronizationState = {
  loading: boolean;
  success?: boolean;
  error?: string;
};

export const useSync = () => {
  const [state, setState] = useState<SynchronizationState>({ loading: false });
  const syncService = useMemo(getSyncService, []);

  const load = useCallback(async () => {
    setState({ loading: true });

    const [{ error }] = await Promise.all([
      syncService.load(),
      new Promise((res) => setTimeout(res, 500)),
    ]);

    if (error) {
      setState({ loading: false, success: false, error });
      toast.error(`Could not load data from the cloud. ${error}`);
    }
    setState({ loading: false, success: true });
    toast.success("Successfully loaded cloud data!");
  }, [syncService]);

  const save = useCallback(async () => {
    const result = await syncService.save();
    if (result?.success) toast.success("Successfully saved data to the cloud!");
    else {
      toast.error(`Could not save data to the cloud. ${result?.cause ?? ""}`);
    }
  }, [syncService]);

  return { state, load, save };
};
