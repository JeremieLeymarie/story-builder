import {
  Toolbar,
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { EditCharacterForm } from "./edit-character-form";
import { useGetCharacterConfig } from "@/builder/hooks/use-get-character-config";
import { SimpleLoader } from "@/design-system/components/simple-loader";

export const CharacterEditor = () => {
  const { characterConfig, isLoading } = useGetCharacterConfig();

  return (
    <Toolbar className="w-80">
      <ToolbarHeader className="flex-row items-center justify-between">
        <ToolbarTitle>Edit character</ToolbarTitle>
      </ToolbarHeader>
      {!characterConfig || isLoading ? (
        <SimpleLoader className="m-auto mt-4" />
      ) : (
        <EditCharacterForm />
      )}
    </Toolbar>
  );
};
