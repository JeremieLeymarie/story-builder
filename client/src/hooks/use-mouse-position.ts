import { XYPosition } from "@xyflow/react";

const state: {
  pos: XYPosition;
  trackingFunc: null | ((ev: MouseEvent) => void);
} = { pos: { x: 0, y: 0 }, trackingFunc: null };
const trackingFunc = (ev: MouseEvent) => {
  state.pos.x = ev.clientX;
  state.pos.y = ev.clientY;
};

export const useMousePosition = () => {
  if (!state.trackingFunc) {
    state.trackingFunc = trackingFunc;
    window.addEventListener("mousemove", state.trackingFunc);
  }
  return state.pos;
};
