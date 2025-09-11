const ctx: {
  pos: { x: number; y: number };
  onMouseMove: null | ((ev: MouseEvent) => void);
} = { pos: { x: 0, y: 0 }, onMouseMove: null };

const onMouseMove = (ev: MouseEvent) => {
  ctx.pos.x = ev.clientX;
  ctx.pos.y = ev.clientY;
};

export const useMousePosition = () => {
  if (!ctx.onMouseMove) {
    ctx.onMouseMove = onMouseMove;
    window.addEventListener("mousemove", ctx.onMouseMove);
  }
  return ctx.pos;
};
