import {
  Toolbar,
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { EditCharacterForm } from "./edit-character-form";

export const CharacterEditor = () => {
  return (
    <Toolbar className="w-80">
      <ToolbarHeader className="flex-row items-center justify-between">
        <ToolbarTitle>Edit character</ToolbarTitle>
      </ToolbarHeader>
      <EditCharacterForm />
    </Toolbar>
  );
};
