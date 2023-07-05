const fs = require("fs");

const isGameFinished = (game) => {
    const playersAlive = game.players.filter(value => value.isAlive);

    if(!game.isStart){
        return game
    }

    if (playersAlive.find( value => value.role === "LoupGarou" ) && playersAlive.length < 3) {
        game.status = "Game_Win_LoupGarou"
        game.isFinish = true
    }else if(!playersAlive.find( value => value.role === "LoupGarou" )){
        game.status = "Game_Win_Villageois"
        game.isFinish = true
    }

    return game;
}
// Fonction pour lire le fichier JSON du jeu
const readGameFromFile = (id) => {
  try {
    if (!fs.existsSync(`db/game${id}.json`)){
        return null;
    }

    const gameData = fs.readFileSync(`db/game${id}.json`);
    return JSON.parse(gameData);
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier game.json :", error);
    return null;
  }
};

// Fonction pour écrire le jeu dans le fichier JSON
const writeGameToFile = (game) => {
  try {
    const checkedGame = isGameFinished(game);
    fs.writeFileSync(`db/game${game.id}.json`, JSON.stringify(checkedGame))
    return true
  } catch (error) {
    console.error("Erreur lors de l'écriture du fichier game.json :", error);
    return false
  }
};

module.exports = {
    readGameFromFile,
    writeGameToFile,
    isGameFinished
}