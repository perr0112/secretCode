# 🧩 Codemaster — Course contre le code

2025 © P. Clément

> 🎓 Projet réalisé dans le cadre du **Mastère Lead Développeur Front-End** à **l’ECV Digital**, pour le module **JS-Algorithmique**, encadré par Monsieur **Alexis Kaboré**.

## Table des matières
1. [🕹️ Description](#️-description)
2. [🌟 Fonctionnalités principales](#-fonctionnalités-principales)
3. [🛠️ Stack technique](#️-stack-technique)
4. [📁 Architecture du projet](#-architecture-du-projet)
5. [🚀 Lancer le projet](#-lancer-le-projet)

---

## 🕹️ Description

**Codemaster** est un jeu de logique et de rapidité dans lequel le joueur doit **deviner un code secret** composé de chiffres.
Chaque tentative est analysée en temps réel :

- Les chiffres **corrects et bien placés** sont indiqués en vert.
- Les chiffres **corrects mais mal placés** en orange.
- Les chiffres **absents du code** en gris.

---

## 🌟 Fonctionnalités principales

- **Génération aléatoire du code secret** selon la difficulté choisie :
  - *Facile* → 3 chiffres, avec un minuteur de 60 secondes
  - *Moyen* → 4 chiffres, avec un minuteur de 45 secondes
  - *Difficile* → 5 chiffres, avec un minuteur de 30 secondes
- **Historique des essais**
- **Saisie au clavier ou via un pavé numérique interactif**
- **Pause / Reprise du jeu** sans perte de progression
- 🏆 **Classement local (Leaderboard)** basé sur la difficulté, le temps et le nombre d’essais
- **Thèmes dynamiques saisonniers** : été, automne, hiver, printemps
- ☀️ **Animations immersives** : ciel dégradé, soleil réaliste, nuages en WebGL, particules flottantes
- 🔈 **Ambiance sonore** adaptée au thème (activable / désactivable selon vos envies dans les paramètres)

---

## 🛠️ Stack technique

- **HTML5 / CSS3**
- **JavaScript ES6**
- **Canvas / WebGL 2.0**
- **LocalStorage API** (sauvegarde du classement et du thème)

---

## 📁 Architecture du projet


```
/
├── index.html
├── app
│   ├── index.js                 # point d'entrée du jeu
│   ├── classes                  # logique du jeu
│   ├── components
│   │   ├── game.js              # écran d'accueil
│   │   ├── home.js              # UI du jeu
│   │   ├── leaderboard.js       # affichage du classement
│   └── ui
│       ├── clouds.js            # nuages en WebGL
│       ├── particles.js         # particules flottantes en fonction du thème
│       ├── settingsModal.js     # modal des paramètres
│       ├── sounds.js            # gestion des sons ambiants
│       ├── theme.js             # thèmes et couleurs
├── assets
│   ├── fonts                    # polices d'écriture
│   ├── icons                    # icônes
│   └── sounds                   # sons ambiants en format .mp3
├── styles
│   ├── normalize.css            # reset des styles par défaut
│   ├── styles.css               # styles globaux
```

---

## 🚀 Lancer le projet

1. Cloner ou télécharger le projet
2. Ouvrir **index.html** avec **Live Server** ou directement dans un navigateur
