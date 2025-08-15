export const getOffset = (node?: HTMLElement) => {
  if (!node) return { left: 0, top: 0 };

  const { top, left } = node.getBoundingClientRect();

  return { top, left };
};
