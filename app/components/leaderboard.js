//     <!-- item : présentation du score d'un joueur -->
//     <div class="ldb__item">
//     <div class="left__content">
//         <div class="rank" data-rank="others">
//         <!-- rank: 'first' | 'second' | 'others' -->
//         <p>2</p>
//         </div>
//         <div class="infos">
//         <p>Pseudo</p>
//         <p class="details">Facile - 34s - 6 essais</p>
//         </div>
//     </div>

//     <div class="score">
//         <p>1030</p>
//     </div>
//     </div>

import { Leaderboard } from "../classes/leaderboard.js";
import { renderHome } from "./home.js";

export const leaderboardModalContent = `
<div class="leaderboard">
  <div class="leaderboard__title">
    <img src="./assets/icons/trophy.png" alt="Trophy" />
    <div class="title">
      <h1>Classement</h1>
      <h3>Les meilleurs scores</h3>
    </div>
  </div>
  <div class="leaderboard__content" id="leaderboardList"></div>
  <div class="ldb__footer">
    <button class="action" id="backBtn">Retour</button>
  </div>
</div>
`;

export const renderLeaderboard = (modal) => {
  modal.innerHTML = leaderboardModalContent

  const leaderboard = new Leaderboard()
  const scores = leaderboard.getScores()
  const list = modal.querySelector("#leaderboardList")

  const getFinalScore = (s) => {
    const multiplier =
      s.difficulty === "easy" ? 1 :
      s.difficulty === "medium" ? 1.3 :
      1.6;
    const base = Math.max(0, 1000 - s.time * 5 - s.attempts * 10);
    return Math.round(base * multiplier);
  };

  const translateDifficulty = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "Facile";
      case "medium":
        return "Moyen";
      case "hard":
        return "Difficile";
      default:
        return difficulty;
    }
  };

  if (!scores.length) {
    list.innerHTML = "<p>Aucun score enregistré pour le moment !</p>";
  } else {
    // tri decroissant (score)
    scores.sort((a, b) => getFinalScore(b) - getFinalScore(a));

    const getScoreItemContent = (s, i) => {
      console.log("---->", s, i)
      const difficultyLabel = translateDifficulty(s.difficulty);
      const finalScore = getFinalScore(s);
      const rankType = i === 0 ? "first" : i === 1 ? "second" : "others";

      return `
        <div class="ldb__item">
          <div class="left__content">
            <div class="rank" data-rank="${rankType}">
              <p>${i + 1}</p>
            </div>
            <div class="infos">
              <p>${s.name}</p>
              <p class="details">
                ${difficultyLabel} – ${s.time}s – ${s.attempts} essais
              </p>
            </div>
          </div>
          <div class="score"><p>${finalScore}</p></div>
        </div>
      `;
    };

    list.innerHTML = scores.map(getScoreItemContent).join("")
  }

  modal.querySelector("#backBtn").addEventListener("click", () => renderHome(modal))
};
