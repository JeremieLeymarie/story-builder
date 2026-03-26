import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/design-system/primitives/select";
import { CharacterConfiguration } from "@/lib/storage/domain";
import { capitalize } from "@/lib/string";

export const CharacterAttributeSelector = ({
  onChange,
  value,
  characterConfig,
}: {
  onChange: (attributeKey?: string) => void;
  value?: string;
  characterConfig: CharacterConfiguration;
}) => {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="*:data-[slot=select-value]:text-xs">
        <SelectValue placeholder="Select a condition" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.values(characterConfig.attributes).map((attribute) => (
            <SelectItem className="text-xs" value={attribute.key}>
              {capitalize(attribute.name)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
