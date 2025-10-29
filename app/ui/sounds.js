const seasonSounds = {
  summer: "./assets/sounds/summer.mp3",
  autumn: "./assets/sounds/autumn.mp3",
  winter: "./assets/sounds/winter.mp3",
  spring: "./assets/sounds/summer.mp3", // identique à summer
}

let audioEl
let currentSrc = ""
let targetVolume = 0.25

function getAudio() {
  if (!audioEl) {
    audioEl = document.createElement("audio")
    audioEl.loop = true
    audioEl.style.display = "none"
    document.body.appendChild(audioEl)
  }
  return audioEl;
}

/** Animation de volume
 * Fondu pour améliorer l'UX
 * Inspiré de ce post - https://stackoverflow.com/questions/64520315/how-to-fade-in-and-out-of-audio
 */
function fade(el, to, duration = 600) {
  const start = el.volume
  const t0 = performance.now()

  const step = (now) => {
    const t = Math.min(1, (now - t0) / duration)
    const res = start + (to - start) * t

    el.volume = Math.max(0, Math.min(1, res));

    if (t < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step);
}

export async function playSeasonSound(theme) {
  const src = seasonSounds[theme];
  const el = getAudio();

  if (src === currentSrc && !el.paused) return;

  fade(el, 0, 400);

  await new Promise((r) => setTimeout(r, 400));

  currentSrc = src;
  el.src = src;
  el.currentTime = 0;
  el.volume = 0;

  try {
    await el.play();
  } catch {
    console.warn("Lecture bloquée, en attente d'une interaction utilisateur");
    return;
  }

  fade(el, targetVolume, 800);
}

export function initSounds() {
  playSeasonSound(localStorage.getItem("theme") || "summer");
}

export function setGlobalVolume(v) {
  targetVolume = Math.max(0, Math.min(1, v))
  const el = getAudio()
  if (!el.paused) el.volume = targetVolume
}
