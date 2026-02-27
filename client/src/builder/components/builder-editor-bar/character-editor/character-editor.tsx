import {
  Toolbar,
  ToolbarClose,
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { AttributeForm } from "./attribute-form";
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
import { BookUserIcon, PlusIcon } from "lucide-react";
import { Button } from "@/design-system/primitives";
import { useCreateCharacterConfig } from "@/builder/hooks/use-create-character-config";
import { useState } from "react";

const EmptyState = () => {
  const { createCharacterConfig } = useCreateCharacterConfig();
  return (
    <Empty>
      <EmptyMedia variant="icon">
        <BookUserIcon />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>No Character yet</EmptyTitle>
        {/* TODO: add docs link */}
        <EmptyDescription>
          A character is the person the player is embodying in your story. They
          can store values in attributes and be used in conditional actions.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => createCharacterConfig()}>Add a character</Button>
      </EmptyContent>
    </Empty>
  );
};

export const CharacterEditor = () => {
  const { characterConfig, isLoading } = useGetCharacterConfig();
  const [isAttributeFormOpen, setIsAttributeFormOpen] = useState(false);

  const showLoader = characterConfig === undefined || isLoading;

  return (
    <div className="z-40 flex gap-3">
      {isAttributeFormOpen && (
        <Toolbar className="relative w-75 bg-white/98">
          <ToolbarClose
            className="absolute top-2 right-2"
            onClick={() => setIsAttributeFormOpen(false)}
          />
          <AttributeForm onSubmit={() => setIsAttributeFormOpen(false)} />
        </Toolbar>
      )}
      <Toolbar className="h-max w-95">
        <ToolbarHeader className="flex-row items-center justify-between">
          <ToolbarTitle>Edit character</ToolbarTitle>
        </ToolbarHeader>
        {showLoader ? (
          <SimpleLoader className="m-auto mt-4" />
        ) : characterConfig === null ? (
          <EmptyState />
        ) : (
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg">Attributes</p>
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={() => setIsAttributeFormOpen(true)}
              >
                <PlusIcon />
              </Button>
            </div>
            {Object.entries(characterConfig.attributes).map(
              ([key, attribute]) => (
                <div key={key}>{attribute.name}</div>
              ),
            )}
          </div>
        )}
      </Toolbar>
    </div>
  );
};
