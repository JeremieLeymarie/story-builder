import { Toolbar } from "@/design-system/components/toolbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/design-system/primitives/accordion";
import { useBuilderErrorStore } from "../hooks/use-builder-error-store";

const ErrorCount = () => {
  const errorCount = useBuilderErrorStore((state) => state.errorCount);
  return (
    <span className="bg-accent pointer-events-none h-5 w-5 rounded-full text-center align-middle">
      {errorCount}
    </span>
  );
};

export const BuilderErrors = () => {
  const [errorCount, _errors] = useBuilderErrorStore((state) => [
    state.errorCount,
    state.errors,
  ]);

  if (!errorCount) return null;

  return (
    <Toolbar className="w-max min-w-48 px-2 py-1">
      <Accordion type="multiple">
        <AccordionItem value="errors">
          <AccordionTrigger className="py-1 hover:no-underline">
            <div className="flex gap-1">
              <ErrorCount />
              <span className="text-accent-foreground">Errors</span>
            </div>
          </AccordionTrigger>
          {/* TODO: actually display errors */}
          <AccordionContent>This is an error</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Toolbar>
  );
};
