import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { ProgressCharacter } from "@/lib/storage/domain";
import {
  ArrowDownFromLineIcon,
  ArrowUpFromLineIcon,
  BookUserIcon,
} from "lucide-react";
import { useLocalGameSettings } from "../hooks/use-local-game-settings";

export const CharacterCard = ({
  character,
}: {
  character?: ProgressCharacter;
}) => {
  const shouldDisplayCharacter = Object.values(
    character?.attributes ?? {},
  ).some((attr) => attr.visibility === "visible");
  const [{ isCharacterCardOpen }, setSettings] = useLocalGameSettings();

  if (!shouldDisplayCharacter) return null;

  return (
    <Card className="gap-1 py-2">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-1">
          <BookUserIcon size={18} /> Your character
        </CardTitle>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            setSettings((prev) => ({
              isCharacterCardOpen: !prev.isCharacterCardOpen,
            }));
          }}
        >
          {isCharacterCardOpen ? (
            <ArrowUpFromLineIcon />
          ) : (
            <ArrowDownFromLineIcon />
          )}
        </Button>
      </CardHeader>
      {/* TODO: animate expand/contract */}
      {isCharacterCardOpen && (
        <CardContent className="flex flex-wrap gap-1">
          {Object.values(character!.attributes).map(
            ({ key, name, value }, i) => (
              <div key={key}>
                <span className="font-semibold">{name}:&nbsp;</span>
                <span>{value}</span>
                {i !== Object.keys(character!.attributes).length - 1 && (
                  <span>&nbsp;·</span>
                )}
              </div>
            ),
          )}
        </CardContent>
      )}
    </Card>
  );
};
