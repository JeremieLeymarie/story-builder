import { Button } from "@/design-system/primitives";
import {
  ArrowDownFromLineIcon,
  ArrowUpFromLineIcon,
  BookOpenTextIcon,
  DownloadIcon,
  PaletteIcon,
  SettingsIcon,
  TestTubesIcon,
} from "lucide-react";
import { ExportModal } from "./export-modal";
import { ButtonShortCutDoc } from "@/design-system/components/shortcut-doc";
import { useBuilderContext } from "../hooks/use-builder-context";
import {
  Toolbar,
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

type ContentProps = {
  toggleExpanded: () => void;
};

const ExpandedToolbarContent = ({ toggleExpanded }: ContentProps) => {
  const { story } = useBuilderContext();
  const { addScene, openBuilderEditor, testStory } = useToolbarActions();
  const btnClassname = "flex w-full justify-start gap-4 w-[225px]";

  return (
    <>
      <ToolbarHeader>
        <div className="flex items-center justify-between">
          <ToolbarTitle>Tools</ToolbarTitle>
          <Button size="icon" variant="ghost" onClick={toggleExpanded}>
            <ArrowUpFromLineIcon size={16} />
          </Button>
        </div>
        <p className="text-muted-foreground truncate italic">{story.title}</p>
      </ToolbarHeader>
      <div className="flex w-full flex-col gap-2">
        <Button
          size="sm"
          className={btnClassname}
          onClick={() => addScene({ position: "auto" })}
        >
          <BookOpenTextIcon />
          Add a scene
          <ButtonShortCutDoc doc="N" />
        </Button>
        <Button
          size="sm"
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
            <Button size="sm" variant="outline" className={btnClassname}>
              <DownloadIcon />
              Export
              <ButtonShortCutDoc doc="E" />
            </Button>
          }
        />
        <Button
          className={btnClassname}
          size="sm"
          variant="outline"
          onClick={() =>
            openBuilderEditor({ type: "story-editor", payload: null })
          }
        >
          <SettingsIcon />
          Edit story
        </Button>
        <Link
          to="/game/ui-editor/$gameKey/$sceneKey"
          target="_blank"
          params={{ gameKey: story.key, sceneKey: story.firstSceneKey }} // For now, always open UI Editor with first scene
        >
          <Button
            className={btnClassname}
            size="sm"
            variant="outline"
            onClick={() =>
              openBuilderEditor({ type: "story-editor", payload: null })
            }
          >
            <PaletteIcon />
            Edit Game UI
          </Button>
        </Link>
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
            <BookOpenTextIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent> Add a scene</TooltipContent>
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
            <SettingsIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent> Open story settings</TooltipContent>{" "}
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/game/ui-editor/$gameKey/$sceneKey"
            target="_blank"
            params={{ gameKey: story.key, sceneKey: story.firstSceneKey }} // For now, always open UI Editor with first scene
          >
            <Button size="icon" variant="ghost">
              <PaletteIcon />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent> Open game UI editor</TooltipContent>
      </Tooltip>
      <Button size="icon" variant="ghost" onClick={toggleExpanded}>
        <ArrowDownFromLineIcon />
      </Button>
    </div>
  );
};

export const BuilderMenu = () => {
  const { isExpanded, toggleExpanded } = useToolbar();

  return (
    <Toolbar>
      {isExpanded ? (
        <ExpandedToolbarContent toggleExpanded={toggleExpanded} />
      ) : (
        <MinifiedToolbarContent toggleExpanded={toggleExpanded} />
      )}
    </Toolbar>
  );
};
