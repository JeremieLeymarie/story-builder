import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/design-system/primitives/chart";
import { Label, Pie, PieChart, Sector } from "recharts";
import { useGetAnalyticsService } from "./hooks/use-get-analytics-service";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import { VisitedScenesData } from "@/domains/game/analytics-service";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { Title } from "@/design-system/components";

export const ProgressRate = ({
  data,
  config,
  rate,
}: {
  data: VisitedScenesData;
  config: ChartConfig;
  rate: number;
}) => {
  return (
    <ChartContainer
      config={config}
      className="mx-auto aspect-square max-h-62.5"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel hideIndicator={false} />}
        />
        <Pie
          data={data}
          dataKey="count"
          nameKey="type"
          innerRadius={60}
          activeIndex={0}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {rate}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      of scenes
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};

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
      {/* <Title variant="sub-section">Game analytics</Title> */}
      <Card>
        <CardHeader>
          <CardTitle>Scenes visited</CardTitle>
          <CardDescription>
            Rate of visited scenes, including all possible paths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressRate {...analyticsService.getVisitedScenesChart()} />
        </CardContent>
      </Card>
    </div>
  );
};
