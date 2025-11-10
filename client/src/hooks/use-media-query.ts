// This is taken from ShadCN (https://github.com/shadcn-ui/ui/blob/main/apps/v4/hooks/use-media-query.tsx)

import { useEffect, useEffectEvent, useState } from "react";

export const useMediaQuery = (query: string) => {
  const mediaQueryList = window.matchMedia(query);
  const [value, setValue] = useState(mediaQueryList.matches);

  const onChange = useEffectEvent((event: MediaQueryListEvent) => {
    setValue(event.matches);
  });

  useEffect(() => {
    mediaQueryList.addEventListener("change", onChange);
    return () => mediaQueryList.removeEventListener("change", onChange);
  }, [query, mediaQueryList]);

  return value;
};
