import { useEffect, useState } from "react";

export const useIsOnline = () => {
  const [network, setNetwork] = useState(navigator.onLine);

  useEffect(() => {
    const onlineHandler = () => setNetwork(true);
    const offlineHandler = () => setNetwork(false);

    addEventListener("online", onlineHandler);

    addEventListener("offline", offlineHandler);

    return () => {
      removeEventListener("online", onlineHandler);
      removeEventListener("offline", offlineHandler);
    };
  }, []);
  return network;
};
