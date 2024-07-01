import { useEffect, useState } from "react";

export const useIsOnline = () => {
  const [network, setNetwork] = useState(navigator.onLine);

  useEffect(() => {
    const onlineHandler = () => setNetwork(true);
    const offlineHandler = () => setNetwork(false);

    addEventListener("online", onlineHandler);

    addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, []);
  return network;
};
