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
  <button class="action" id="menuBtn">Menu</button>
</div>

<div class="game__tries">
  <p>Historique des tentatives</p>
  <div class="tries" id="tries"></div>
</div>

<div class="game">
  <p>Entrez votre code</p>
  <div class="game__code" id="codeInputs"></div>
</div>
`;

export const renderGameScreen = (modal, game) => {
  modal.innerHTML = gameModalContent

  const timerEl = modal.querySelector("#timer")
  const attemptsEl = modal.querySelector("#attempts")
  const triesEl = modal.querySelector("#tries")
  const codeInputsEl = modal.querySelector("#codeInputs")
  const menuBtn = modal.querySelector("#menuBtn")

  const codeLength = game.getPlayer().difficulty === "easy" ? 3 : game.getPlayer().difficulty === "medium" ? 4 : 5;

  for (let i = 0; i < codeLength; i++) {
    const input = document.createElement("input");
    input.type = "text"
    input.maxLength = 1
    input.placeholder = "0"
    input.required = true
  
    codeInputsEl.appendChild(input);
  }

  const inputs = Array.from(codeInputsEl.querySelectorAll("input"))

  const difficulty = game.getPlayer().difficulty
  let remainingTime = difficulty === "easy" ? 60 : difficulty === "medium" ? 45 : 30;

  const timer = setInterval(() => {
    remainingTime--
    timerEl.textContent = `0:${remainingTime.toString().padStart(2, "0")}`

    if (remainingTime <= 0) {
      clearInterval(timer)

      // à améliorer
      alert("Temps écoulé ⏰")
      renderLeaderboard(modal)
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

    console.log(result)
    
    // details:
    // [ { value: 2, status: 'misplaced' }, { value: 5, status: 'correct' }]
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

    // Victoire - affichage du classement directement
    if (result.isCorrect) {
      clearInterval(timer) // nettoyage
      setTimeout(() => renderLeaderboard(modal), 1000)
    }

    inputs.forEach((i) => (i.value = ""))
    inputs[0].focus()
  };

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      // focus du prochain input
      if (input.value && index < inputs.length - 1) inputs[index + 1].focus();

      // test du code si dernier input renseigné
      else if (index === inputs.length - 1) submitGuess();
    })
  })

  menuBtn.addEventListener("click", () => {
    clearInterval(timer)
    renderHome(modal)
  });

  inputs[0].focus()
};
