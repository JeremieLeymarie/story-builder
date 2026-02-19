import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { useGetAnalyticsService } from "../hooks/use-get-analytics-service";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import { Title } from "@/design-system/components";
import { StoryProgressVisualization } from "../progress-visualization/story-progress-visualization";
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
          <CardDescription className="flex items-end justify-between">
            <span>Visualization of your progress in the story</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StoryProgressVisualization analyticsService={analyticsService} />
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-2xs text-foreground/75 flex h-5 w-10 items-center justify-center rounded-sm border">
              name
            </div>
            <span>Visited</span>
            <div className="bg-muted/75 text-2xs text-foreground/75 ml-2 flex h-5 w-10 items-center justify-center rounded-sm border">
              ???
            </div>
            <span>Not visited</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
