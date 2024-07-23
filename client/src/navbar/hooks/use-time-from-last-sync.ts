import { useCallback, useEffect, useState } from "react";
import { SYNCHRO_DATETIME_KEY } from "./use-synchronization";
import { timeFrom } from "@/lib/date";

export const useTimeFromLastSync = () => {
  const [time, setTime] = useState<string | null>(null);

  const updateTime = useCallback(() => {
    const date = sessionStorage.getItem(SYNCHRO_DATETIME_KEY);
    setTime(date ? timeFrom(date) : null);
  }, []);

  useEffect(() => {
    // Update time every 5 seconds
    const interval = setInterval(updateTime, 5000);

    // Update when storage is updated
    window.addEventListener("session-storage", updateTime);

    return () => {
      // Clear everything on unmount
      clearInterval(interval);
      window.removeEventListener("session-storage", updateTime);
    };
  }, [updateTime]);

  return time;
};
