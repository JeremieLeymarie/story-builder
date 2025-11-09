import { useEffect } from "react";

const pos: {
  x: number;
  y: number;
} = { x: 0, y: 0 };

const onPointerMove = (ev: MouseEvent) => {
  pos.x = ev.clientX;
  pos.y = ev.clientY;
};

export const useGetMousePosition = () => {
  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
    };
  });

  return () => ({ x: pos.x, y: pos.y });
};
