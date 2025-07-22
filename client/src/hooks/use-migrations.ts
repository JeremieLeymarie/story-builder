import { executeMigrations } from "@/lib/storage/migrations";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export const useMigrations = () => {
  const mutation = useMutation({
    mutationKey: ["MIGRATIONS"],
    mutationFn: async () => {
      await executeMigrations();
    },
    onSuccess: () => {
      toast.success("Database successfully updated");
    },
    onError: () => {
      toast.error("Error", {
        description: "An error occurred while trying to update your database.",
      });
    },
  });

  useEffect(() => {
    if (mutation.isIdle) {
      mutation.mutateAsync();
    }
  }, [mutation]);

  return {
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};
