export const getEditorContainerInfo = (
  editor: { getRootElement: () => HTMLElement | null },
  maxWidth?: number,
) => {
  const editorRootElement = editor.getRootElement();

  let maxWidthContainer = 100;
  let maxHeightContainer = 100;

  if (maxWidth !== undefined) {
    maxWidthContainer = maxWidth;
  } else if (editorRootElement) {
    maxWidthContainer = editorRootElement.getBoundingClientRect().width - 20;
  }

  if (editorRootElement) {
    maxHeightContainer = editorRootElement.getBoundingClientRect().height - 20;
  }

  return { maxWidthContainer, maxHeightContainer };
};
