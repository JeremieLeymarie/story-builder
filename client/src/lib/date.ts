import dayjs, { ConfigType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const timeFrom = (date: ConfigType) => {
  return dayjs(date).fromNow();
};

export const formatDate = (date: ConfigType) =>
  dayjs(date).format("dddd, MMMM D, YYYY");
