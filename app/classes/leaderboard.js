// import { Player } from '../types/data';
import { LocalStorageManager } from './localStorage.js';

export class Leaderboard {
  storageKey = 'secretcode_leaderboard';
  storage;

  constructor() {
    this.storage = new LocalStorageManager();
  }

  getScores() {
    return this.storage.get(this.storageKey) || [];
  }

  /**
   * Enregistrer le score d'un joueur dans le classement
   * @param {*} player - object
   */
  saveScore(player) {
    const scores = this.getScores()
    scores.push(player)

    // tri des scores
    scores.sort((a, b) => {
      if (a.hasWon !== b.hasWon) return a.hasWon ? -1 : 1
      if (a.time !== b.time) return a.time - b.time
      return a.attempts - b.attempts
    })

    this.storage.set(this.storageKey, scores)
  }

  clearScores() {
    this.storage.remove(this.storageKey);
  }
}
