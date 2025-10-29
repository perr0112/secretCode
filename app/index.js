import { renderHome } from "./components/home.js";

window.addEventListener("DOMContentLoaded", () => {
  console.log("app entrypoint - fire scripts")
  const modal = document.querySelector(".modal__content")

  if (!modal) return

  renderHome(modal)
});
