// <!-- jeu : affichage des essais -->
// <div class="tries">
//     <div class="try">
//     <div class="try__index">
//         <p>#3</p>
//     </div>
//     <div class="try__numbers">
//         <div class="number" data-type="misplaced">
//         <p>2</p>
//         </div>
//         <div class="number" data-type="correct">
//         <p>2</p>
//         </div>
//         <div class="number" data-type="absent">
//         <p>2</p>
//         </div>
//         <div class="number" data-type="absent">
//         <p>2</p>
//         </div>
//     </div>
//     </div>
// </div>
// </div>

import { renderHome } from "./home.js";
import { renderLeaderboard } from "./leaderboard.js";

export const gameModalContent = `
<div class="game__options">
  <div class="options__infos">
    <p class="action" id="timer">--:--</p>
    <p class="action" id="attempts">Essais: 0</p>
  </div>
  <div style="display: flex; flex-direction: row; gap: 10rem;">
    <button class="action" id="pauseBtn">Pause</button>
    <button class="action" id="homeBtn">Accueil</button>
  </div>
</div>

<div class="game__tries">
  <p>Historique des tentatives</p>
  <div class="tries" id="tries"></div>
</div>

<div class="game">
  <p>Entrez votre code</p>
  <div class="game__code" id="codeInputs"></div>
  <div class="keypad" id="keypad"></div>
</div>
`;

export const renderGameScreen = (modal, game) => {
  modal.innerHTML = gameModalContent;

  // elements
  const timerEl = modal.querySelector("#timer")
  const attemptsEl = modal.querySelector("#attempts")
  const triesEl = modal.querySelector("#tries")
  const codeInputsEl = modal.querySelector("#codeInputs")
  const keypadEl = modal.querySelector("#keypad")
  const pauseBtn = modal.querySelector("#pauseBtn")
  const homeBtn = modal.querySelector("#homeBtn")

  const difficulty = game.getPlayer().difficulty
  const codeLength = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;
  let remainingTime = difficulty === "easy" ? 60 : difficulty === "medium" ? 45 : 30;
  
  for (let i = 0; i < codeLength; i++) {
    const input = document.createElement("input");
    input.type = "text"
    input.maxLength = 1
    input.name = "code"
    input.placeholder = "0"
    input.required = true

    codeInputsEl.appendChild(input);
  }

  const inputs = Array.from(codeInputsEl.querySelectorAll("input"))

  const timer = setInterval(() => {
    remainingTime--
    timerEl.textContent = `0:${remainingTime.toString().padStart(2, "0")}`

    if (remainingTime <= 0) {
      clearInterval(timer)

      clearInterval(timerInterval)
      renderModalLost(game.revealCode())
    }
  }, 1000);

  const submitGuess = () => {
    const guess = inputs.map((i) => i.value).join("")
    if (guess.length !== codeLength) return

    const result = game.makeGuess(guess)
    attemptsEl.textContent = `Essais: ${game.getPlayer().attempts}`;

    const attemptDiv = document.createElement("div");
    attemptDiv.classList.add("try");

    const indexDiv = document.createElement("div");
    indexDiv.classList.add("try__index");
    indexDiv.innerHTML = `<p>#${game.getPlayer().attempts}</p>`;

    const numbersDiv = document.createElement("div");
    numbersDiv.classList.add("try__numbers");

    result.details.forEach((item) => {
      const numDiv = document.createElement("div")
      numDiv.classList.add("number")
      numDiv.dataset.type = item.status
      numDiv.innerHTML = `<p>${item.value}</p>`

      numbersDiv.appendChild(numDiv);
    });

    attemptDiv.appendChild(indexDiv)
    attemptDiv.appendChild(numbersDiv)
    triesEl.prepend(attemptDiv)

    if (result.isCorrect) {
      clearInterval(timer) // nettoyage
      setTimeout(() => renderLeaderboard(modal), 1000)
    }

    inputs.forEach((i) => (i.value = ""))
    inputs[0].focus()
  };

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value && index < inputs.length - 1) {
        inputs[index + 1].focus()
      } else if (index === inputs.length - 1 && input.value) {
        submitGuess()
      }
    })

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        inputs[index - 1].focus()
      }
    })
  })

  // pavé numérique
  const keys = [...Array(10).keys()];

  keys.forEach((n) => {
    console.log("=====> keypads", n)

    const btn = document.createElement("button")
    btn.textContent = n
    btn.classList.add("keypad__key")

    btn.addEventListener("click", () => {
      const current = inputs.find((i) => i === document.activeElement)
      const next = inputs.find((i) => !i.value)
      const target = current || next || inputs[0]
      target.value = n

      const currentIndex = inputs.indexOf(target)

      if (currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus()
      } else if (inputs.every((i) => i.value)) {
        submitGuess()
      }
    })
    keypadEl.appendChild(btn)
  })

  homeBtn.addEventListener("click", () => {
    clearInterval(timer)
    renderHome(modal)
  })

  let paused = false;
  let timerInterval = timer

  pauseBtn.addEventListener("click", () => {
    if (!paused) {
      paused = true
      clearInterval(timerInterval)
      pauseBtn.textContent = "Reprendre ▶️"
      timerEl.style.color = "red"

      // important: désactiver les input et keypad

      inputs.forEach((i) => (i.disabled = true))
      keypadEl.querySelectorAll("button").forEach((b) => (b.disabled = true))
    } else {
      paused = false;
      pauseBtn.textContent = "Pause ⏸️";
      pauseBtn.style.color = "white";
      timerEl.style.color = "white";

      inputs.forEach((i) => (i.disabled = false))
      keypadEl.querySelectorAll("button").forEach((b) => (b.disabled = false))

      timerInterval = setInterval(() => {
        remainingTime--;
        timerEl.textContent = `0:${remainingTime.toString().padStart(2, "0")}`;
        if (remainingTime <= 0) {
          clearInterval(timerInterval);
          renderModalLost(game.revealCode());
        }
      }, 1000);
    }
  });

  // - focus initial
  inputs[0].focus()
};

const renderModalLost = (code) => {
  const lostModal = document.createElement("div")
  lostModal.classList.add("modal__lost__game")

  lostModal.innerHTML = `
    <div class="modal__lost__game--content">
      <h3>Partie terminée</h3>
      <div class="content__modal-lostgame">
        <p>Le code était ${code}.</p>
        <div style="display: flex; gap: 10rem;">
          <button class="action" id="goHomeBtn">Accueil</button>
          <button class="action" id="goLeaderboardBtn">Classement</button>
        </div>
      </div>
    </div>
  `

  document.querySelector(".modal__content").appendChild(lostModal)

  lostModal.querySelector("#goHomeBtn").addEventListener("click", () => renderHome(document.querySelector(".modal__content")))
  lostModal.querySelector("#goLeaderboardBtn").addEventListener("click", () => renderLeaderboard(document.querySelector(".modal__content")))
};
