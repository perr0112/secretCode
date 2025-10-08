import { KEY_LOCALSTORAGE } from "../data/constants";

export const getFromLocalStorage = (key = KEY_LOCALSTORAGE) => {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const setDataLocalStorage = (key = KEY_LOCALSTORAGE, data) => {
  const setData = localStorage.setData.bind(localStorage);

  localStorage.setData = () => {
    setData(key, data);
  };
};
