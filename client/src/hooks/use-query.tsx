import { useEffect, useState } from "react";

export const useInitialQuery = <T,>(queryFn: () => Promise<T>) => {
  const [state, setState] = useState<T>();

  useEffect(() => {
    queryFn().then((res) => setState(res));
  }, [queryFn]);

  return state;
};
