import { useEffect } from "react";

const pos: {
  x: number;
  y: number;
} = { x: 0, y: 0 };

const onMouseMove = (ev: MouseEvent) => {
  pos.x = ev.clientX;
  pos.y = ev.clientY;
};

export const useGetMousePosition = () => {
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  });

  return () => ({ x: pos.x, y: pos.y });
};
