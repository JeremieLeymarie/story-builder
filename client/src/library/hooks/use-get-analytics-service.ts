import { makeAnalyticsService } from "@/domains/game/analytics-service";
import { useQuery } from "@tanstack/react-query";

export const useGetAnalyticsService = ({
  progressKey,
  gameKey,
}: {
  progressKey: string;
  gameKey: string;
}) => {
  const { data: analyticsService, isLoading } = useQuery({
    queryKey: ["get-analytics-service", progressKey, gameKey],
    queryFn: async () => makeAnalyticsService({ progressKey, gameKey }),
  });

  return { analyticsService, isLoading };
};
