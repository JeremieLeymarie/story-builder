import { Button } from "@/design-system/primitives";
import { toast } from "sonner";
import { useBuilderContext } from "./use-builder-context";

export const useErrorToast = () => {
  const { refresh } = useBuilderContext();

  return {
    handleError: (error: unknown) => {
      console.error(error);
      toast.error("Something went wrong, please refresh the page", {
        action: (
          <Button variant="secondary" onClick={() => refresh()}>
            Refresh
          </Button>
        ),
      });
    },
  };
};
