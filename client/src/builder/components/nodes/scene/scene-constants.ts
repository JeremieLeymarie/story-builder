const style = getComputedStyle(document.body);
const actionInnerPadding = 8;
const fontHeight = 24;
export const sceneConsts = {
  text2xl: parseFloat(style.getPropertyValue("--text-2xl")) * 2,
  width: 375,
  actionGap: 2,
  itemPadding: 24,
  editIconSize: 20,
  handleSize: parseFloat(style.getPropertyValue("--xy-handle-size")), // assuming in px,
  fontHeight,
  actionInnerPadding,
  actionHeight: 2 * actionInnerPadding + fontHeight,
};
