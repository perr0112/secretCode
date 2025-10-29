/*
Options: {
    difficulty: string,
    numberOfDigits: integer (3-6)
}
*/

// import { GAME_DEFAULT_OPTIONS } from "../data/constants";
// import { GameOptions } from "../types/data";
import { Leaderboard } from "./leaderboard.js";

export class Game {
  secretCode;
  startTime;
  player;
  leaderboard;

  constructor(playerName, difficulty) {
    this.player = {
      name: playerName,
      difficulty,
      attempts: 0,
      hasWon: false,
      // time: difficulty === "easy" ? 30 : difficulty === "medium" ? 45 : 60;
      time: 0,
    }

    this.leaderboard = new Leaderboard()
    this.secretCode = this.generateSecretCode(difficulty)
    this.startTime = Date.now()
  }

  /**
   * Génère un code secret aléatoire en fonction de la difficulté choisie
   * J'ai opté pour un code qui change en fonction de la difficulté, en plus du temps raccourci
   * @param {*} difficulty -> easy | medium | hard
   * @returns un tableau de nombre
   */
  generateSecretCode(difficulty) {
    const length = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;
    const digits = Array.from({ length }, () => Math.floor(Math.random() * 10));
    console.log(digits);

    return digits.join("");
  }

  /**
   * Compare la proposition du joueur avec le code secret
   * @param {*} guess | string (code)
   * @returns {Object} -> { isCorrect: boolean, details: { value: number, status: 'absent' } }
   */
  makeGuess(guess) {
    const secret = this.secretCode.split("").map(Number);
    const attempt = guess.split("").map(Number);

    this.player.attempts++;

    let correct = 0;
    let misplaced = 0;

    const secretCopy = [...secret]
    const attemptCopy = [...attempt]
    console.log(secretCopy, attemptCopy, guess);

    const details = [];

    attempt.forEach((num, i) => {
      if (num === secret[i]) {
        correct++
        details.push({ value: num, status: "correct" })

        secretCopy[i] = null // reset
        attemptCopy[i] = null // reset
      }
      // Provoque une erreur -> à check
      // else if (num !== null && secretCopy.includes(num)) {
      //   misplaced++;
      //   details[i].status = "misplaced";
      //   secretCopy[secretCopy.indexOf(num)] = null;
      // }
      else {
        details.push({ value: num, status: "absent" });
      }
    });

    attemptCopy.forEach((num, i) => {
      if (num !== null && secretCopy.includes(num)) {
        misplaced++
        details[i].status = "misplaced"
        secretCopy[secretCopy.indexOf(num)] = null
      }
    });

    const isCorrect = correct === secret.length

    if (isCorrect) {
      this.player.hasWon = true
      this.player.time = Math.floor((Date.now() - this.startTime) / 1000)
      this.leaderboard.saveScore(this.player)
    }

    const res = { isCorrect, details }

    console.log(res)

    return res
  }

  /**
   * @returns current player
   */
  getPlayer() {
    return this.player;
  }

  /**
   * Fonction dans le cas où on l'on voudrait montrer le code qui devait être saisi
   * @returns secretCode
   */
  revealCode() {
    return this.secretCode;
  }
}
