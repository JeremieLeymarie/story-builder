import { Toolbar } from "@/design-system/components/toolbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/design-system/primitives/accordion";
import {
  useBuilderErrorStore,
  BuilderError,
} from "../hooks/use-builder-error-store";
import { match } from "ts-pattern";
import { useReactFlow } from "@xyflow/react";
import { FIT_VIEW_DURATION } from "../constants";
import { ScrollArea } from "@/design-system/primitives/scroll-area";
import { InvalidActionTargetPercentagesError } from "../builder-errors";
import React from "react";

const ErrorCount = () => {
  const errorCount = useBuilderErrorStore((state) => state.getErrorCount());
  return (
    <span className="bg-accent pointer-events-none h-5 w-5 rounded-full text-center align-middle text-xs/relaxed">
      {errorCount}
    </span>
  );
};

const InvalidActionTargetErrorDisplay = ({
  payload,
}: {
  payload: InvalidActionTargetPercentagesError["payload"];
}) => {
  const { fitView } = useReactFlow();

  const zoomInOnEdges = () =>
    fitView({
      nodes: [
        { id: payload.sourceSceneKey },
        ...payload.targetSceneKeys.map((key) => ({
          id: key,
        })),
      ],
      duration: FIT_VIEW_DURATION,
    });

  return (
    <div onClick={zoomInOnEdges} className="h-full w-full cursor-pointer">
      Scene{" "}
      <span className="font-semibold">
        {payload.sceneName || "[Untitled Scene]"}
      </span>
      : Invalid percentages, total is {payload.probabilityTotal}% and must be
      exactly 100%.
    </div>
  );
};

const BuilderErrorDisplay = ({ error }: { error: BuilderError }) => {
  return (
    <div className="hover:bg-primary/45 px-2 py-2 transition-all">
      {match(error)
        .with({ type: "invalid-action-target-percentages" }, ({ payload }) => (
          <InvalidActionTargetErrorDisplay payload={payload} />
        ))
        .exhaustive()}
    </div>
  );
};

export const BuilderErrorsToolbar = () => {
  const [errorCount, errors] = useBuilderErrorStore((state) => [
    state.getErrorCount(),
    state.errors,
  ]);

  if (!errorCount) return null;

  const sortedErrors = Object.values(errors)
    .flat()
    .sort(
      (a, b) =>
        a.metadata.occurredAt.getTime() - b.metadata.occurredAt.getTime(),
    );

  return (
    <Toolbar className="w-full min-w-48 px-0 py-1">
      <Accordion type="multiple">
        <AccordionItem value="errors">
          <AccordionTrigger className="px-2 py-1 hover:no-underline">
            <div className="flex gap-2">
              <ErrorCount />
              <span className="text-accent-foreground">
                Error{errorCount === 1 ? "" : "s"}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-0 text-xs">
            <ScrollArea>
              <div className="max-h-100">
                {sortedErrors.map((error) => (
                  <React.Fragment key={error.id}>
                    <BuilderErrorDisplay
                      key={`${error.type}-${error.id}`}
                      error={error}
                    />
                  </React.Fragment>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Toolbar>
  );
};
