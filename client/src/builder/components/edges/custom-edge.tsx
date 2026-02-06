import { useEdgeProbability } from "@/builder/hooks/use-edge-probability";
import { BuilderEdge } from "@/builder/types";
import { Input } from "@/design-system/primitives";
import { cn } from "@/lib/style";
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
} from "@xyflow/react";

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
  const { inputRef, isFocused, setIsFocused, onChange, value, hasError } =
    useEdgeProbability({
      source,
      sourceHandleId,
      id,
      target,
      data,
    });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={style}
        markerEnd={markerEnd}
        className={cn(hasError && "stroke-destructive!")}
      />
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
                hasError && "border-destructive text-destructive",
              )}
            >
              {isFocused ? (
                <Input
                  autoFocus
                  defaultValue={`${value}%`}
                  className={cn(
                    "h-full border-none px-2 text-center md:text-base",
                  )}
                  onBlur={onChange}
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
