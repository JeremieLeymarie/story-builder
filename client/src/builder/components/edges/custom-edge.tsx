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
import { RefCallback, FocusEvent } from "react";

const EdgeProbabilityLabel = ({
  inputRef,
  hasError,
  labelX,
  labelY,
  isFocused,
  setIsFocused,
  onChange,
  value,
}: {
  inputRef: RefCallback<HTMLElement>;
  hasError: boolean;
  labelX: number;
  labelY: number;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  onChange: (e: FocusEvent) => void;
  value: number;
}) => {
  return (
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
          "relative flex h-8 w-14 origin-center cursor-pointer items-center justify-center rounded-lg border bg-white text-sm",
          hasError && "border-destructive text-destructive",
        )}
      >
        {isFocused ? (
          <Input
            autoFocus
            defaultValue={`${value}%`}
            className={cn("h-full border-none px-1 text-center")}
            onBlur={onChange}
            ref={inputRef}
          />
        ) : (
          <span>{value}%</span>
        )}
      </div>
    </div>
  );
};

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
      <EdgeLabelRenderer>
        {data?.hasSiblings && (
          <EdgeProbabilityLabel
            labelX={labelX}
            labelY={labelY}
            hasError={hasError}
            inputRef={inputRef}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            onChange={onChange}
            value={value}
          />
        )}
        {debug && (
          <div
            style={{
              transform: `translate(-15%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="nodrag nopan"
          >
            <span className="text-muted-foreground absolute top-10 text-xs">
              {id}
            </span>
          </div>
        )}
      </EdgeLabelRenderer>
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
