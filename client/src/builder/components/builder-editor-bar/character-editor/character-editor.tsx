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
import {
  BookUserIcon,
  EyeClosedIcon,
  EyeIcon,
  PencilIcon,
  PencilOffIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/design-system/primitives";
import { useCreateCharacterConfig } from "@/builder/hooks/use-create-character-config";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/design-system/primitives/table";
import { CharacterAttribute } from "@/lib/storage/domain";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";

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

type AttributeToolbarState =
  | { type: "add" }
  | { type: "edit"; payload: CharacterAttribute }
  | null;

const useAttributeToolbar = () => {
  const [state, setState] = useState<AttributeToolbarState>(null);

  const close = () => {
    setState(null);
  };

  const open = (props: Exclude<AttributeToolbarState, null>) => {
    setState(props);
  };

  return {
    open,
    close,
    isOpen: state !== null,
    state,
  };
};

export const CharacterEditor = () => {
  const { characterConfig, isLoading } = useGetCharacterConfig();
  const { open, close, isOpen, state } = useAttributeToolbar();

  const showLoader = characterConfig === undefined || isLoading;

  console.log({ state, isOpen });
  return (
    <div className="z-40 flex gap-3">
      {isOpen && (
        <Toolbar className="relative w-75 bg-white/98">
          <ToolbarClose className="absolute top-2 right-2" onClick={close} />
          <AttributeForm
            onSubmit={close}
            defaultValues={state!.type === "add" ? null : state!.payload}
          />
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
              <p className="text-lg font-semibold">Attributes</p>
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={() => open({ type: "add" })}
              >
                <PlusIcon />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Initial Value</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Edition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(characterConfig.attributes).map(
                  ([key, attribute]) => (
                    <TableRow
                      key={key}
                      onClick={() =>
                        isOpen &&
                        (state?.type === "add" ||
                          attribute.key === state?.payload.key)
                          ? close()
                          : open({ type: "edit", payload: attribute })
                      }
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        {attribute.name}
                      </TableCell>
                      <TableCell>{attribute.initialValue}</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            {attribute.visibility === "visible" ? (
                              <EyeIcon size={14} />
                            ) : (
                              <EyeClosedIcon size={14} />
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            The{" "}
                            <span className="font-semibold">
                              {attribute.name}
                            </span>{" "}
                            attribute is{" "}
                            {attribute.visibility === "visible"
                              ? "visible"
                              : "not visible"}{" "}
                            by the player in the story
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            {attribute.isEditableByPlayer ? (
                              <PencilIcon size={14} />
                            ) : (
                              <PencilOffIcon size={14} />
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            The&nbsp;
                            <span className="font-semibold">
                              {attribute.name}
                            </span>
                            &nbsp;attribute&nbsp;
                            {attribute.isEditableByPlayer ? "can" : "cannot"}
                            &nbsp;be edited by the player in the story
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Toolbar>
    </div>
  );
};
