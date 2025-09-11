import { ChangeEvent, useState } from "react";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../primitives";
import { chunk } from "@/lib/array";
import { randomInArray } from "@/lib/random";
import { RefreshCcwIcon } from "lucide-react";
import { HEX_COLOR_REGEX } from "@/lib/colors";

const DEFAULT_COLORS = [
  "#c1121f",
  "#ACC12F",
  "#ffb703",
  "#219ebc",
  "#2C3D55",
  "#cdb4db",
  "#5A2328",
  "#4ECDC4",
  "#BA2C73",
  "#99582a",
  "#BFD7EA",
  "#E71D36",
  "#0077b6",
  "#14213d",
  "#fb8500",
  "#ffafcc",
];

export const ColorPicker = ({
  defaultValue,
  onChange,
}: {
  defaultValue?: string;
  onChange: (color: string) => void;
}) => {
  const [color, setColor] = useState(
    defaultValue?.match(HEX_COLOR_REGEX)
      ? defaultValue
      : randomInArray(DEFAULT_COLORS),
  );

  const _onChange = (e: ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;
    // Here we only do the most basic validation, since the consumer will be responsible for use-case specific validation (using zod + react-hook-form)
    if (value.match(HEX_COLOR_REGEX)) {
      setColor(value);
      onChange(value);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-description="color picker"
          variant="outline"
          role="color-picker"
          className="flex gap-0 p-0"
        >
          <div
            className="h-full w-16 rounded-l-md"
            style={{ backgroundColor: color }}
          ></div>
          <div className="px-3">
            <p>{color}</p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max">
        <div className="flex gap-1">
          <Input
            className="h-8 w-full"
            placeholder={color}
            onChange={_onChange}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => setColor(randomInArray(DEFAULT_COLORS))}
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
                  setColor(color);
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
