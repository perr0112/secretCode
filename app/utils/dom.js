export const $ = (element) => document.querySelector(element);

export const $all = (element) => document.querySelectorAll(element);

export const getAttribute = (element, attribute = "name") => {
  if (!element) return;
  return element.getAttribute(attribute);
};

export const hasAttribute = (element, attribute = "name") => {
  if (!element) return;
  return element.hasAttribute(attribute);
};

export const retrieveRootVariables = (element, variable) => {
  if (!element || !variable) return;
  return window.getComputedStyle(element).getPropertyValue(variable);
};

export const toggleActive = (element, state) => {
  if (!element || !state) return;
  element.dataset.active = !state;
};
