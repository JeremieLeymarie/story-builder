import { useCallback, useEffect } from "react";

type UseBuilderKeyboard = {};

export const useBuilderKeyboard = ({}: UseBuilderKeyboard) => {
  const handler = useCallback((e: KeyboardEvent) => {
    console.log(e.preventDefault());
    console.log(e.key);
    if (e.metaKey && e.key === "N") {
      console.log("in");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keypress", handler);

    return () => {
      window.removeEventListener("keypress", handler);
    };
  }, [handler]);
};
