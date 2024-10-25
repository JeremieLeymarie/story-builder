export type OS = "Mac" | "Linux" | "Windows" | null;

export const getUserOS = (): OS => {
  const platform = // @ts-expect-error navigator.userAgentData is an experimental feature, typescript doesn't know about it yet (cf https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/platform)
    (navigator.userAgentData?.platform || navigator.platform)?.toLowerCase();

  if (platform.startsWith("win")) return "Windows";
  if (platform.startsWith("mac")) return "Mac";
  if (platform.startsWith("linux")) return "Linux";

  return null;
};
