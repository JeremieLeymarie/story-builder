import { LexicalEditor } from "lexical";

export const getEditorContainerInfo = (
  editor: LexicalEditor,
  maxWidth?: number,
) => {
  const editorRootElement = editor.getRootElement();

  let maxWidthContainer = 100;
  let maxHeightContainer = 100;

  if (maxWidth !== undefined) {
    maxWidthContainer = maxWidth;
  } else if (editorRootElement) {
    maxWidthContainer = editorRootElement.getBoundingClientRect().width - 30;
  }

  if (editorRootElement) {
    maxHeightContainer = editorRootElement.getBoundingClientRect().height - 30;
  }

  return { maxWidthContainer, maxHeightContainer };
};
