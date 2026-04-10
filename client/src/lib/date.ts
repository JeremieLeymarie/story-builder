import dayjs, { ConfigType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const timeFrom = (date: ConfigType) => {
  return dayjs(date).fromNow();
};

export const formatDate = (date: ConfigType) =>
  dayjs(date).format("dddd, MMMM D, YYYY");

export const formatDurationHHMMSS = (durationMs: number) => {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
};
