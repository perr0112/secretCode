import { playSeasonSound, setGlobalVolume } from "./sounds.js"

let soundEnabled = JSON.parse(localStorage.getItem("soundEnabled") || "true")

export function initSettingsModal() {
  const soundSwitch = document.getElementById("soundSwitch")

  // initialise la position du switch
  soundSwitch.checked = soundEnabled

  soundSwitch.addEventListener("change", () => {
    soundEnabled = soundSwitch.checked
    localStorage.setItem("soundEnabled", soundEnabled)

    const currentTheme = localStorage.getItem("theme") || "summer"

    if (soundEnabled) {
      setGlobalVolume(0.25)
      playSeasonSound(currentTheme)
    } else {
      setGlobalVolume(0)
    }
  });

  if (soundEnabled) {
    const currentTheme = localStorage.getItem("theme") || "summer"
    playSeasonSound(currentTheme)
  }
}
