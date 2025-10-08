const cancelClick = (element) => {
  if (!element) return;
  element.style.pointerEvents = "none";
};

const customCursor = (element, type = "auto") => {
  if (!element) return;
  element.style.cursor = type;
};

const enableScroll = () => {
  scroll.start();
};

const enableClick = (element) => {
  if (!element) return;
  element.style.pointerEvents = "auto";
};

const stopScroll = () => {
  scroll.destroy();
};

export { stopScroll, enableScroll, enableClick, cancelClick, customCursor };
