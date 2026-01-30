import { BuilderEdge } from "@/builder/types";
import { Input } from "@/design-system/primitives";
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
} from "@xyflow/react";
import { FormEvent, useState } from "react";
import { useMaskito } from "@maskito/react";
import { MaskitoOptions } from "@maskito/core";
import {
  maskitoCaretGuard,
  maskitoPostfixPostprocessorGenerator,
} from "@maskito/kit";
import z from "zod";
import { cn } from "@/lib/style";
import { toast } from "sonner";
import { useBuilderContext } from "@/builder/hooks/use-builder-context";
import { useBuilderError } from "@/builder/hooks/use-builder-error";

const percentMask = {
  mask: /([0-9]{0,3})/,
  postprocessors: [maskitoPostfixPostprocessorGenerator("%")],
  plugins: [
    // First item = min index for caret, last item = max index
    maskitoCaretGuard((value) => [0, value.length - 1]),
  ],
} satisfies MaskitoOptions;

const schema = z.int().min(0).max(100);

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  source,
  sourceHandleId,
  target,
  style,
  data,
}: EdgeProps<BuilderEdge>) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useMaskito({ options: percentMask });
  const [value, setValue] = useState(data?.probability ?? 0);
  const { builderService } = useBuilderContext();
  const { handleError } = useBuilderError();

  if (!sourceHandleId) throw new Error(`Edge with no source handle: ${id}`);

  const onBlur = (e: FormEvent) => {
    const val = parseInt((e.target as HTMLInputElement).value);
    const parsed = schema.safeParse(val);
    if (parsed.error) {
      toast.error("Invalid value: only values between 0 and 100 are allowed");
    } else {
      builderService
        .updateTargetProbability({
          sourceSceneKey: source,
          actionKey: sourceHandleId,
          targetSceneKey: target,
          probability: val,
        })
        .catch(handleError);
      setValue(val);
    }
    setIsFocused(false);
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
      {data?.hasSiblings && (
        <EdgeLabelRenderer>
          <div className="nodrag nopan absolute z-10">
            <div
              style={{
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: "all", // does not exist in tailwind
              }}
              onClick={() => {
                setIsFocused(true);
              }}
              className={cn(
                "flex h-10 w-16 origin-center cursor-pointer items-center justify-center rounded border bg-white text-base",
              )}
            >
              {isFocused ? (
                <Input
                  autoFocus
                  defaultValue={`${value}%`}
                  className={cn(
                    "h-full border-none px-2 text-center md:text-base",
                  )}
                  onBlur={onBlur}
                  ref={inputRef}
                />
              ) : (
                <span>{value}%</span>
              )}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomEdge;
