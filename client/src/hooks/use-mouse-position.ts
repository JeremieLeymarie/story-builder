const pos = { x: 0, y: 0 };
export const useMousePosition = () => {
  document.onmousemove = (ev) => {
    pos.x = ev.clientX;
    pos.y = ev.clientY;
  };
  return { getMousePosition: () => pos };
};
