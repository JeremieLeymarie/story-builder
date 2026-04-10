import { getGameService } from "@/domains/game/game-service";
import { useEffect, useEffectEvent, useRef } from "react";

export const useTrackStoryPlayTime = ({
  enabled,
  progressKey,
  sceneKey,
}: {
  enabled: boolean;
  progressKey: string;
  sceneKey: string;
}) => {
  const startedAtRef = useRef<number | null>(null);

  const startTracking = useEffectEvent(() => {
    if (!enabled || document.visibilityState !== "visible") return;
    if (startedAtRef.current !== null) return;

    startedAtRef.current = Date.now();
  });

  const flushTracking = useEffectEvent(async () => {
    const startedAt = startedAtRef.current;
    startedAtRef.current = null;

    if (!enabled || startedAt === null) return;

    const elapsedMs = Date.now() - startedAt;
    if (elapsedMs <= 0) return;

    try {
      await getGameService().addPlayTime(progressKey, elapsedMs);
    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
    if (!enabled) return;

    startTracking();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        void flushTracking();
        return;
      }

      startTracking();
    };

    const handlePageHide = () => {
      void flushTracking();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      void flushTracking();
    };
  }, [enabled, sceneKey, progressKey]);
};
