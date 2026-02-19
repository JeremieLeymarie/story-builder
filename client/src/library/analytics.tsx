import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { useGetAnalyticsService } from "./hooks/use-get-analytics-service";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import { Title } from "@/design-system/components";
import { StoryProgressVisualization } from "./progress-visualization/story-progress-visualization";
import { VisitedScenesChart } from "./visited-scenes-chart";

export const Analytics = ({
  progressKey,
  gameKey,
}: {
  progressKey: string;
  gameKey: string;
}) => {
  const { analyticsService, isLoading } = useGetAnalyticsService({
    progressKey,
    gameKey,
  });
  if (isLoading || !analyticsService) return <SimpleLoader />;

  return (
    <div className="space-y-4">
      <Title variant="section">Game analytics</Title>
      <Card>
        <CardHeader>
          <CardTitle>Scenes visited</CardTitle>
          <CardDescription>
            Rate of visited scenes, including all possible paths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VisitedScenesChart {...analyticsService.getVisitedScenesChart()} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Progress summary</CardTitle>
          {/* <CardDescription>
            Rate of visited scenes, including all possible paths
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <StoryProgressVisualization />
        </CardContent>
      </Card>
    </div>
  );
};
