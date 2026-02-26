import {
  Toolbar,
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { EditCharacterForm } from "./edit-character-form";
import { useGetCharacterConfig } from "@/builder/hooks/use-get-character-config";
import { SimpleLoader } from "@/design-system/components/simple-loader";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/design-system/primitives/empty";
import { BookUserIcon } from "lucide-react";
import { Button } from "@/design-system/primitives";
import { useCreateCharacterConfig } from "@/builder/hooks/use-create-character-config";

export const CharacterEditor = () => {
  const { characterConfig, isLoading } = useGetCharacterConfig();
  const { createCharacterConfig } = useCreateCharacterConfig();

  const showLoader = characterConfig === undefined || isLoading;

  return (
    <Toolbar className="w-95">
      <ToolbarHeader className="flex-row items-center justify-between">
        <ToolbarTitle>Edit character</ToolbarTitle>
      </ToolbarHeader>
      {showLoader ? (
        <SimpleLoader className="m-auto mt-4" />
      ) : characterConfig === null ? (
        <Empty>
          <EmptyMedia variant="icon">
            <BookUserIcon />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No Character yet</EmptyTitle>
            {/* TODO: add docs link */}
            <EmptyDescription>
              A character is the person the player is embodying in your story.
              They can store values in attributes and be used in conditional
              actions.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => createCharacterConfig()}>
              Add a character
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <EditCharacterForm />
      )}
    </Toolbar>
  );
};
