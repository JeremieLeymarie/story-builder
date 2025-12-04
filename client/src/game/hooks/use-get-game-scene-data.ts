import { getThemeService } from "@/domains/builder/theme-service";
import { getGameService } from "@/domains/game/game-service";
import { useQuery } from "@tanstack/react-query";

export const useGetGameSceneData = ({
  storyKey,
  sceneKey,
}: {
  storyKey: string;
  sceneKey: string;
}) => {
  const { data: theme, isLoading: isThemeLoading } = useQuery({
    queryKey: ["story-theme", storyKey],
    queryFn: async () => getThemeService().getTheme(storyKey),
  });

  const { data: scene, isLoading: isSceneLoading } = useQuery({
    queryKey: ["scene-data", sceneKey],
    queryFn: async () => getGameService().getSceneData(sceneKey),
  });

  return { theme, scene, isLoading: isThemeLoading || isSceneLoading };
};
