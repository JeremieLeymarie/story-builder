import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives";
import { ProgressCharacter, SideEffect } from "@/lib/storage/domain";
import {
  ArrowDownFromLineIcon,
  ArrowUpFromLineIcon,
  BookUserIcon,
} from "lucide-react";
import { useLocalGameSettings } from "../hooks/use-local-game-settings";
import React from "react";
import { cn } from "@/lib/style";

const CharacterAttribute = ({
  name,
  value,
  triggeredEffect,
}: {
  name: string;
  value: number;
  triggeredEffect?: SideEffect; // The eventual effect that was just triggered on this specific attribute
}) => {
  const shouldShowUpdate = triggeredEffect?.isVisible;

  return (
    <div>
      <span className="font-semibold select-none">{name}:&nbsp;</span>
      <span className={cn("select-none", shouldShowUpdate && "font-semibold")}>
        {value}
        {shouldShowUpdate && (
          <span className="animate-pulse align-text-top text-xs font-normal text-emerald-600 select-none">
            &nbsp;({triggeredEffect.effect.increment >= 0 ? "+" : "-"}
            {triggeredEffect.effect.increment})
          </span>
        )}
      </span>
    </div>
  );
};

export const CharacterCard = ({
  character,
  triggeredSideEffects,
}: {
  character?: ProgressCharacter;
  triggeredSideEffects: SideEffect[];
}) => {
  const visibleAttributes = Object.values(character!.attributes).filter(
    (attr) => attr.visibility === "visible",
  );

  const shouldDisplayCharacter = visibleAttributes.length > 0;
  const [{ isCharacterCardOpen }, setSettings] = useLocalGameSettings();
  const wereCharacterSideEffectsTriggered =
    triggeredSideEffects.filter(
      (se) => se.effect.type === "character-attribute",
    ).length > 0;

  if (!shouldDisplayCharacter) return null;

  return (
    <Card
      className={cn(
        "gap-1 py-2",
        wereCharacterSideEffectsTriggered && "ring-emerald-600",
      )}
      onClick={() => {
        setSettings((prev) => ({
          isCharacterCardOpen: !prev.isCharacterCardOpen,
        }));
      }}
    >
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-1 select-none">
          <BookUserIcon size={18} /> Your character
        </CardTitle>
        <Button
          variant="ghost"
          size="icon-xs"
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
          {visibleAttributes.map(({ key, name, value }, i) => (
            <React.Fragment key={key}>
              <CharacterAttribute
                name={name}
                value={value}
                triggeredEffect={triggeredSideEffects.find(
                  (effectConfig) => effectConfig.effect.attributeKey === key,
                )}
              />
              {i !== visibleAttributes.length - 1 && (
                <span className="select-none">&nbsp;·</span>
              )}
            </React.Fragment>
          ))}
        </CardContent>
      )}
    </Card>
  );
};
