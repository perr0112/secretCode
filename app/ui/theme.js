import { setSeason } from "./clouds.js";
import { startParticles } from "./particles.js";
import { playSeasonSound } from "./sounds.js";

export function initThemeSystem() {
  const themeBtn = document.getElementById("settingsBtn")
  const themeModal = document.querySelector(".settings-modal")
  const closeThemeModal = document.getElementById("closeSettingsModal")
  const themeButtons = document.querySelectorAll(".settings-modal [data-theme]")

  let currentTheme = localStorage.getItem("theme") || "summer"

  function applyTheme(theme) {
    const root = document.documentElement
    const body = document.body

    root.style.setProperty("--background-sky-linear", `linear-gradient(180deg, var(--top-sky-${theme}) 0%, var(--bottom-sky-${theme}) 50%)`)
    root.style.setProperty("--background-grass-1-linear", `linear-gradient(180deg, var(--top-grass-1-${theme}) 25%, var(--bottom-grass-1-${theme}) 50%)`)
    root.style.setProperty("--background-grass-2-linear", `linear-gradient(180deg, var(--top-grass-2-${theme}) 0%, var(--bottom-grass-2-${theme}) 75%)`)

    body.classList.remove("theme-summer", "theme-autumn", "theme-winter", "theme-spring")
    body.classList.add(`theme-${theme}`)

    localStorage.setItem("theme", theme)
    currentTheme = theme

    startParticles(theme)
    playSeasonSound(theme)
    setSeason(theme)
  }

  themeBtn.addEventListener("click", () => themeModal.classList.remove("hidden"))
  closeThemeModal.addEventListener("click", () => themeModal.classList.add("hidden"))

  themeButtons.forEach(btn =>
    btn.addEventListener("click", () => applyTheme(btn.dataset.theme))
  )

  applyTheme(currentTheme)
}
