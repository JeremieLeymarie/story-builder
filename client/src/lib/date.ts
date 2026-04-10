import dayjs, { ConfigType } from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const timeFrom = (date: ConfigType) => {
  return dayjs(date).fromNow();
};

export const formatDate = (date: ConfigType) =>
  dayjs(date).format("dddd, MMMM D, YYYY");

export const formatDurationHHMMSS = (durationMs: number) => {
  const safeDurationMs = Number.isFinite(durationMs)
    ? Math.max(0, durationMs)
    : 0;

  return dayjs.duration(safeDurationMs).format("HH:mm:ss");
};
