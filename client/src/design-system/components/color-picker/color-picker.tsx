import { forwardRef, HTMLAttributes, useState } from "react";
import { chunk } from "@/lib/array";
import { randomInArray } from "@/lib/random";
import { PencilIcon, RefreshCcwIcon } from "lucide-react";
import { HEX_COLOR_REGEX } from "@/lib/colors";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/design-system/primitives";
import { DEFAULT_COLORS } from "./constants";
import { match } from "ts-pattern";

type Size = "sm" | "md";

type InputProps = {
  size: Size;
  color: string;
} & HTMLAttributes<HTMLButtonElement>;

const ColorPickerInput = forwardRef<HTMLButtonElement, InputProps>(
  ({ size, color, ...props }, ref) => {
    return match(size)
      .with("sm", () => (
        <button
          {...props}
          ref={ref}
          aria-description="color picker"
          className="group flex h-8 w-8 items-center justify-center rounded-full transition-all ease-in-out hover:opacity-90"
          style={{ backgroundColor: color }}
        >
          <PencilIcon
            size={14}
            className="invisible text-black/75 group-hover:visible"
          />
        </button>
      ))
      .with("md", () => (
        <Button
          {...props}
          ref={ref}
          aria-description="color picker"
          variant="outline"
          role="color-picker"
          className="flex w-max gap-0 p-0"
        >
          <div
            className="h-full w-16 rounded-l-md"
            style={{ backgroundColor: color }}
          ></div>
          <div className="px-3">
            <p>{color}</p>
          </div>
        </Button>
      ))
      .exhaustive();
  },
);

export const ColorPicker = ({
  defaultValue,
  onChange,
  position,
  offset,
  size = "md",
}: {
  defaultValue?: string;
  onChange: (color: string) => void;
  position?: "bottom" | "top" | "right" | "left";
  offset?: number;
  size?: Size;
}) => {
  const [color, setColor] = useState(
    defaultValue?.match(HEX_COLOR_REGEX)
      ? defaultValue
      : randomInArray(DEFAULT_COLORS),
  );

  const _onChange = (value: string) => {
    // Here we only do the most basic validation, since the consumer will be responsible for use-case specific validation (using zod + react-hook-form)
    if (value.match(HEX_COLOR_REGEX)) {
      setColor(value);
      onChange(value);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ColorPickerInput color={color} size={size} />
      </PopoverTrigger>
      <PopoverContent className="w-max" side={position} sideOffset={offset}>
        <div className="flex gap-1">
          <Input
            className="h-8 w-full"
            placeholder={color}
            onChange={(e) => _onChange((e.target as HTMLInputElement).value)}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => _onChange(randomInArray(DEFAULT_COLORS))}
          >
            <RefreshCcwIcon />
          </Button>
        </div>
        <p className="mt-2 text-sm font-semibold">Presets</p>
        {chunk(DEFAULT_COLORS, 8).map((colors) => (
          <div className="my-2 flex gap-2" key={colors.join("-")}>
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => {
                  _onChange(color);
                }}
                className="h-6 w-8 cursor-pointer rounded"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
