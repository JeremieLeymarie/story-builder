export enum Direction {
  north = 1 << 0,
  south = 1 << 1,
  east = 1 << 2,
  west = 1 << 3,
}

type UserSelectState = {
  value: string;
  priority: string;
};

export const setResizeCursor = (
  direction: number,
  editorRootElement: HTMLElement | null,
  userSelect: UserSelectState,
) => {
  const isEW = direction === Direction.east || direction === Direction.west;
  const isNS = direction === Direction.north || direction === Direction.south;
  const isNWSE =
    (direction & Direction.north && direction & Direction.west) ||
    (direction & Direction.south && direction & Direction.east);

  const cursorDir = isEW ? "ew" : isNS ? "ns" : isNWSE ? "nwse" : "nesw";
  const cursorValue = `${cursorDir}-resize`;

  if (editorRootElement) {
    editorRootElement.style.setProperty("cursor", cursorValue, "important");
  }

  document.body.style.setProperty("cursor", cursorValue, "important");

  userSelect.value = document.body.style.getPropertyValue(
    "-webkit-user-select",
  );
  userSelect.priority = document.body.style.getPropertyPriority(
    "-webkit-user-select",
  );

  document.body.style.setProperty("-webkit-user-select", "none", "important");
};
