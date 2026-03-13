import { useSafeLocalStorage } from "@/hooks/use-safe-local-storage";
import z from "zod";

const GAME_SETTINGS_LS_KEY = "game-settings";
const schema = z.object({ isCharacterCardOpen: z.boolean().catch(false) });

export const useLocalGameSettings = () => {
  return useSafeLocalStorage(GAME_SETTINGS_LS_KEY, schema);
};
