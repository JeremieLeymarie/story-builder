import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

export const useIsWaitingForTooLong = ({
  tooLong,
  startTimestamp,
}: {
  tooLong: number;
  startTimestamp: number;
}) => {
  const [isWaitingForTooLong, setIsWaitingForTooLong] = useState(false);
  const interval = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    const updatePendingState = () =>
      setIsWaitingForTooLong(
        startTimestamp !== 0 &&
          dayjs().diff(startTimestamp, "seconds") > tooLong,
      );

    if (startTimestamp !== 0)
      interval.current = setInterval(updatePendingState, 500);

    return () => clearInterval(interval.current);
  }, [startTimestamp, tooLong]);

  return isWaitingForTooLong;
};
