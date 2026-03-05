import { MaskitoOptions } from "@maskito/core";
import { Input } from "../primitives/input";
import { useMaskito } from "@maskito/react";
import { RefCallback } from "react";

const mask = {
  mask: /^[0-9]*$/, // Only numbers
} satisfies MaskitoOptions;

/**
 * A uncontrolled number input
 * For now it doesn't handle :
 * - Negative numbers
 * - Floats
 * - Setting the value via ⌃⌄
 * Feel free to add these features
 */
export const NumberInput = ({
  ref,
  onChange,
  className,
  defaultValue,
}: {
  ref?: RefCallback<HTMLInputElement>;
  onChange: (v: number | undefined) => void;
  className?: string;
  defaultValue: number;
}) => {
  const inputRef = useMaskito({ options: mask });

  return (
    <Input
      ref={(node) => {
        inputRef(node);
        if (typeof ref === "function") ref(node);
      }}
      // Maskito strongly suggests using onInput rather than onChange => https://maskito.dev/frameworks/react
      onInput={(e) => {
        const stringValue = e.currentTarget.value;
        if (stringValue !== "") onChange?.(parseInt(stringValue));
        else onChange?.(undefined);
      }}
      defaultValue={defaultValue}
      className={className}
    />
  );
};
