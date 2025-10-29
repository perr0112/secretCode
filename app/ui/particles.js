let particleInterval;
const particlesContainer = document.getElementById("particles")

export function createParticle(maxSize = 8) {
  const particle = document.createElement("div")
  particle.classList.add("particle")

  const size = 3 + Math.random() * maxSize
  const startX = Math.random() * window.innerWidth
  const delay = Math.random() * 5

  particle.style.width = `${size}px`
  particle.style.height = `${size}px`
  particle.style.left = `${startX}px`
  particle.style.bottom = `${Math.random() * 100}px`

  particle.style.animationDuration = `${8 + Math.random() * 6}s`
  particle.style.animationDelay = `${delay}s`

  particlesContainer.appendChild(particle)
  setTimeout(() => particle.remove(), 16000)
}

const THEME_CONFIGS = {
  summer: { interval: 300, maxSize: 6 },
  autumn: { interval: 200, maxSize: 8 },
  winter: { interval: 180, maxSize: 5 },
  spring: { interval: 350, maxSize: 7 },
};

export function startParticles(theme = "summer") {
  clearInterval(particleInterval)
  const config = THEME_CONFIGS[theme] || THEME_CONFIGS.summer
  particleInterval = setInterval(() => createParticle(config.maxSize), config.interval)
}

export function initParticles() {
  startParticles(localStorage.getItem("theme") || "summer");
}
