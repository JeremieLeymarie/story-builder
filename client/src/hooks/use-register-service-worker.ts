import { useRegisterSW } from "virtual:pwa-register/react";

// 1 hour
const PERIOD = 60 * 60 * 1000;

/**
 * Register the service worker and periodically checks for updates
 */
export const useRegisterServiceWorker = () => {
  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
  } = useRegisterSW({
    onRegistered(registration) {
      if (registration)
        setInterval(() => {
          registration.update();
        }, PERIOD);
    },
  });

  return { offlineReady, needRefresh };
};
