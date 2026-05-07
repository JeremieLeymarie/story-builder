export const NODE_WIDTH = Number.parseFloat(
  window
    .getComputedStyle(document.body)
    .getPropertyValue("--node-width")
    .replace("px", ""),
);
