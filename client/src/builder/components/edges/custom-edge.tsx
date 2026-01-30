import { BuilderEdge } from "@/builder/types";
import { Input } from "@/design-system/primitives";
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
} from "@xyflow/react";
import { useState } from "react";
import { useMaskito } from "@maskito/react";
import { MaskitoOptions } from "@maskito/core";
import {
  maskitoCaretGuard,
  maskitoPostfixPostprocessorGenerator,
} from "@maskito/kit";

const percentMask = {
  mask: /([0-9]{0,3}\.?[0-9]{0,2})/,
  postprocessors: [maskitoPostfixPostprocessorGenerator("%")],
  plugins: [
    // First item = min index for caret, last item = max index
    maskitoCaretGuard((value) => [0, value.length - 1]),
  ],
} satisfies MaskitoOptions;

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
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

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
      {data?.hasSiblings && (
        <EdgeLabelRenderer>
          <div
            onClick={() => {
              setIsFocused(true);
            }}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all", // does not exist in tailwind
            }}
            className="nodrag nopan absolute z-10 flex h-10 w-16 origin-center cursor-pointer items-center justify-center rounded border bg-white text-base"
          >
            {isFocused ? (
              <Input
                autoFocus
                defaultValue={`${data.probability}%`}
                className="h-full border-none px-2 text-center md:text-base"
                onBlur={() => setIsFocused(false)}
                ref={inputRef}
              />
            ) : (
              <span>{data.probability}%</span>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomEdge;
