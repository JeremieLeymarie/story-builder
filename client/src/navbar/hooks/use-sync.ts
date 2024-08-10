import { toast } from "@/design-system/primitives/use-toast";
import { getSyncService } from "@/services/sync-service";
import { useCallback, useMemo, useState } from "react";

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
      toast({
        title: "Error",
        description: `Could not load data from the cloud. ${error}`,
        variant: "destructive",
      });
    }
    setState({ loading: false, success: true });
    toast({ title: "Success", description: "Successfully loaded cloud data!" });
  }, [syncService]);

  const save = useCallback(async () => {
    const result = await syncService.save();
    if (result?.success)
      toast({
        title: "Success",
        description: "Successfully saved data to the cloud!",
      });
    else {
      toast({
        title: "Error",
        description: `Could not save data to the cloud. ${result?.cause ?? ""}`,
        variant: "destructive",
      });
    }
  }, [syncService]);

  return { state, load, save };
};
