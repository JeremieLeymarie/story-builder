import { Button } from "@/design-system/primitives";
import {
  ArrowDownFromLineIcon,
  ArrowUpFromLineIcon,
  BookOpenTextIcon,
  DownloadIcon,
  PaletteIcon,
  TestTubesIcon,
  BookUserIcon,
  NotebookTextIcon,
} from "lucide-react";
import { ExportModal } from "./export-modal";
import { ButtonShortCutDoc } from "@/design-system/components/shortcut-doc";
import { useBuilderContext } from "../hooks/use-builder-context";
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeader,
  ToolbarTitle,
} from "@/design-system/components/toolbar";
import { Link } from "@tanstack/react-router";
import { useToolbar, useToolbarActions } from "../hooks/use-toolbar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/design-system/primitives/tooltip";
import { cn } from "@/lib/style";
import { Divider } from "@/design-system/components";

type ContentProps = {
  toggleExpanded: () => void;
};

const ExpandedToolbarContent = ({ toggleExpanded }: ContentProps) => {
  const { story } = useBuilderContext();
  const { addScene, openBuilderEditor, testStory } = useToolbarActions();
  const btnClassname = "flex w-full justify-start gap-4";

  return (
    <>
      <ToolbarHeader>
        <div className="flex items-center justify-between">
          <ToolbarTitle>Tools</ToolbarTitle>
          <Button size="icon" variant="ghost" onClick={toggleExpanded}>
            <ArrowUpFromLineIcon size={16} />
          </Button>
        </div>
        <ToolbarDescription className="truncate">
          {story.title}
        </ToolbarDescription>
      </ToolbarHeader>
      <div className="flex w-full flex-col gap-2">
        <Button
          className={btnClassname}
          onClick={() => addScene({ position: "auto" })}
        >
          <NotebookTextIcon />
          Add a scene
          <ButtonShortCutDoc doc="N" />
        </Button>
        <Button
          variant="outline"
          className={btnClassname}
          onClick={() => testStory(story.firstSceneKey)}
        >
          <TestTubesIcon />
          Test
          <ButtonShortCutDoc doc="T" />
        </Button>
        <ExportModal
          trigger={
            <Button variant="outline" className={btnClassname}>
              <DownloadIcon />
              Export
              <ButtonShortCutDoc doc="E" />
            </Button>
          }
        />
        <div className="flex justify-center">
          <Divider className="h-0.5 w-9/10" />
        </div>
        <Button
          className={btnClassname}
          variant="outline"
          onClick={() =>
            openBuilderEditor({ type: "story-editor", payload: null })
          }
        >
          <BookOpenTextIcon />
          Edit story
        </Button>
        <Link
          to="/game/theme-editor/$gameKey/$sceneKey"
          target="_blank"
          params={{ gameKey: story.key, sceneKey: story.firstSceneKey }} // For now, always open UI Editor with first scene
        >
          <Button className={btnClassname} variant="outline">
            <PaletteIcon />
            Edit Game Theme
          </Button>
        </Link>
        <Button
          className={btnClassname}
          variant="outline"
          onClick={() => {
            openBuilderEditor({ type: "character-editor", payload: null });
          }}
        >
          <BookUserIcon />
          Edit Character
        </Button>
      </div>
    </>
  );
};

const MinifiedToolbarContent = ({ toggleExpanded }: ContentProps) => {
  const { story } = useBuilderContext();
  const { addScene, openBuilderEditor, testStory } = useToolbarActions();

  return (
    <div className="flex gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" onClick={() => addScene({ position: "auto" })}>
            <NotebookTextIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add a scene</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => testStory(story.firstSceneKey)}
          >
            <TestTubesIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Test your story</TooltipContent>
      </Tooltip>
      <ExportModal
        tooltip="Export your story"
        trigger={
          <Button size="icon" variant="ghost">
            <DownloadIcon />
          </Button>
        }
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              openBuilderEditor({ type: "story-editor", payload: null })
            }
          >
            <BookOpenTextIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Open story settings</TooltipContent>{" "}
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/game/theme-editor/$gameKey/$sceneKey"
            target="_blank"
            params={{ gameKey: story.key, sceneKey: story.firstSceneKey }} // For now, always UI Editor with first scene
          >
            <Button size="icon" variant="ghost">
              <PaletteIcon />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>Open game theme editor</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              openBuilderEditor({ type: "character-editor", payload: null });
            }}
          >
            <BookUserIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Open character editor</TooltipContent>
      </Tooltip>
      <Button size="icon" variant="ghost" onClick={toggleExpanded}>
        <ArrowDownFromLineIcon />
      </Button>
    </div>
  );
};

export const BuilderToolbar = () => {
  const { isExpanded, toggleExpanded } = useToolbar();

  return (
    <Toolbar className={cn(isExpanded && "w-60")}>
      {isExpanded ? (
        <ExpandedToolbarContent toggleExpanded={toggleExpanded} />
      ) : (
        <MinifiedToolbarContent toggleExpanded={toggleExpanded} />
      )}
    </Toolbar>
  );
};
