import { renderHome } from "./components/home.js";
import { initThemeSystem } from "./ui/theme.js";
import { initParticles } from "./ui/particles.js";
import { initSounds } from "./ui/sounds.js";
import { renderClouds } from "./ui/clouds.js";
import { initSettingsModal } from "./ui/settingsModal.js";

window.addEventListener("DOMContentLoaded", () => {
  // Fire all scripts

  const modal = document.querySelector(".modal__content");
  if (!modal) return;

  renderHome(modal);

  // init UI
  initThemeSystem();
  initParticles();
  initSounds();
  renderClouds();
  initSettingsModal();
});
