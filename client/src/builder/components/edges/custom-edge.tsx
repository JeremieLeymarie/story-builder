import { useBuilderContext } from "@/builder/hooks/use-builder-context";
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

const InnerEdge = ({
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
  const { debug } = useBuilderContext();
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
                "relative flex h-10 w-16 origin-center cursor-pointer items-center justify-center rounded border bg-white text-base",
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
              {debug && (
                <span className="text-muted-foreground absolute top-10 text-xs">
                  {id}
                </span>
              )}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

const CustomEdge = (props: EdgeProps<BuilderEdge>) => {
  // We need to have an extra layer to pass a key, forcing to re-mount the component when the probability change
  // This avoids re-setting the state in a useEffect (https://react.dev/learn/you-might-not-need-an-effect)
  return (
    <InnerEdge key={`${props.id}-${props.data?.probability}`} {...props} />
  );
};

export default CustomEdge;
