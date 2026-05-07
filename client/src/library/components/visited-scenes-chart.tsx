import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/design-system/primitives/chart";
import { Label, Pie, PieChart, Sector } from "recharts";
import { VisitedScenesData } from "@/domains/game/analytics-service";
import { PieSectorShapeProps } from "recharts/types/polar/Pie";

export const VisitedScenesChart = ({
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
          shape={({
            index,
            outerRadius = 0,
            ...props
          }: PieSectorShapeProps) => (
            <Sector
              {...props}
              outerRadius={index === 0 ? outerRadius + 10 : outerRadius}
            />
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
