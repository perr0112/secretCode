import { renderGameScreen } from "./game.js";
import { renderLeaderboard } from "./leaderboard.js";
import { Game } from "../classes/Game.js";

export const homeModalContent = `
<div class="content__title">
  <h1>Codemaster</h1>
  <h3>Course contre le code</h3>
</div>

<form>
  <div class="form__input">
    <label for="pseudo">Votre pseudo</label>
    <input type="text" name="pseudo" id="pseudo" required placeholder="Saisissez votre pseudo" />
  </div>

  <div class="form__input">
    <label for="difficulty">Choix de la difficulté</label>

    <div class="difficulty-option">
      <input type="radio" id="easy" name="difficulty" value="easy" checked />
      <div class="background__checkbox"></div>
      <label for="easy"><p>Facile</p><span>60 secondes</span></label>
    </div>

    <div class="difficulty-option">
      <input type="radio" id="medium" name="difficulty" value="medium" />
      <div class="background__checkbox"></div>
      <label for="medium"><p>Moyen</p><span>45 secondes</span></label>
    </div>

    <div class="difficulty-option">
      <input type="radio" id="hard" name="difficulty" value="hard" />
      <div class="background__checkbox"></div>
      <label for="hard"><p>Difficile</p><span>30 secondes</span></label>
    </div>
  </div>

  <div class="form__footer">
    <button type="submit" class="btn action" id="startGameBtn">Commencer</button>
    <button type="button" class="btn action" id="viewLeaderboardBtn">Voir le classement</button>
  </div>
</form>
`;

export const renderHome = (modal) => {
  if (!modal) return

  modal.innerHTML = homeModalContent

  const form = modal.querySelector("form")
  const leaderboardBtn = modal.querySelector("#viewLeaderboardBtn")

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const pseudo = (document.getElementById("pseudo")).value.trim()
    const difficulty = (form.querySelector('input[name="difficulty"]:checked'))
      .value

    if (!pseudo) return

    const game = new Game(pseudo, difficulty)
    renderGameScreen(modal, game)
  })

  leaderboardBtn.addEventListener("click", () => renderLeaderboard(modal))
};
