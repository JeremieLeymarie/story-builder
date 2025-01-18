import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";

export const useIsWaitingForTooLong = ({
  tooLong,
  startTimestamp,
}: {
  tooLong: number;
  startTimestamp: number;
}) => {
  const updatePendingState = useCallback(
    () =>
      setIsWaitingForTooLong(
        startTimestamp !== 0 &&
          dayjs().diff(startTimestamp, "seconds") > tooLong,
      ),
    [startTimestamp, tooLong],
  );
  const [isWaitingForTooLong, setIsWaitingForTooLong] = useState(false);
  const interval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (startTimestamp !== 0)
      interval.current = setInterval(updatePendingState, 500);

    return () => clearInterval(interval.current);
  }, [startTimestamp, updatePendingState]);

  return isWaitingForTooLong;
};
