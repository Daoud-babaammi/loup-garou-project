const { readGameFromFile, writeGameToFile, isGameFinished } = require("../helper/game");
const { v4: uuidv4 } = require("uuid");
const { rolesRepartiteur, getRoleByStatus } = require("../helper/roles");

exports.loginController = (req, res) => {
  const { playerName, idGame, imageUser } = req.body;
  // Créer un joueur avec un ID unique
  const playerId = uuidv4();
  const player = {
    id: playerId,
    name: playerName,
    isAlive: true,
    imageUser: imageUser
  };

  let game = null;

  if(idGame){
    game = readGameFromFile(idGame);

    if(game === null){
        res.json({code: 404, message: "la game que vous chercher na pas etait trouver"})
    }
  }else{
    game = { id: uuidv4(), createBy: player.id, players: [], playersLive: 0, isNight: false, isLaunchable: false, isStart: false, isFinish: false, status: "Salle_Attend", votes: [] };
  }
 

  // Vérifier si le joueur existe déjà dans le jeu
  const existingPlayer = game.players.find((p) => p.name === playerName);
  if (existingPlayer) {
    res
      .status(400)
      .send("Le nom de joueur est déjà utilisé. Veuillez en choisir un autre.");
      return
  }

  // Ajouter le nouveau joueur à la liste des joueurs du jeu
  game.players.push(player);

  if (game.players.length >= 5){
    game.isLaunchable = true
  }
  // Écrire le jeu mis à jour dans le fichier
  writeGameToFile(game);

  res.send({ code: 202, idPlayer: player.id, idGame: game.id });
}

exports.startController = (req, res) => {
    const { idGame, idPlayer } = req.body;

    const game = readGameFromFile(idGame);

    if(!game){
        res.status(400).send({ code:400, message: "Votre game n'a pas été trouvé" });
        return;
    }

    if(idPlayer != game.createBy){
        res.status(400).send({ code:400, message: "Vous neut pouver pas lancer" });
        return;
    }

    const gameStartable = rolesRepartiteur(game)

    gameStartable.isStart = true;
    gameStartable.isNight = true;

    if (gameStartable.players.find(value => value.role === "Cupidon")) {
        gameStartable.status = "Tour_De_Cupidon";
    }else{
        gameStartable.status = "Tour_Du_LoupGarou"
    }

    writeGameToFile(gameStartable)

    res.send({code: 200, message: "success" })
}

exports.gameInfosController = (req,res,next) => {
    const { idGame, idPlayer } = req.params;
    
    const game = readGameFromFile(idGame);
    console.log(game);
    const player = game.players.find(value=> value.id === idPlayer);
    const listPlayer = game.players.map(value => ({ id: value.id, name: value.name, isAlive: value.isAlive, imageUser: value.imageUser || 1}));
    let youTurn = false;
    if (!player) {
      res.status(404).json({ message: "Player not found"+idPlayer });
      return;
  }
    if(game.isStart){
      const roleTour = getRoleByStatus(game.status)
      youTurn = (roleTour === 'All')? true : (player.role === roleTour) 
    }
    res.send({ user: player, youTurn, listPlayer, lastPlayerKilledId: game.lastPlayerKilledId,  isStableBy: (game.createBy === idPlayer), isStart: game.isStart, isNight: game.isNight, isLaunchable: game.isLaunchable, isFinish: game.isFinish, status: game.status, idGame: game.id });
}


exports.voteController = (req, res) => {
  const {idGame, idPlayer} = req.params;
  const { voteFor } = req.body;
  const game = readGameFromFile(idGame);
  const votes = game.votes || [];
  console.log(votes);
  // Enregistrer ce vote
  if(!votes.some(vote => vote.playerId === idPlayer) && game.players.find(value => value.id === idPlayer && value.isAlive)){
    votes.push({ playerId: idPlayer, voteFor}) 
    game.votes = votes
    writeGameToFile(game);
  }
  
  // Vérifier si tous les joueurs ont voté  
   if(votes.length === game.players.filter(player => player.isAlive).length){
    // compter les votes
    const voteCounts = {};
    for (let vote of votes){
        if(voteCounts[vote.voteFor]){
            voteCounts[vote.voteFor]++;
        }else {
            voteCounts[vote.voteFor] = 1
        }
    }

    let maxVote = 0;
    let playerToLynch = "";

    Object.entries(voteCounts).forEach((key, value)=> {
      if(maxVote < value){
        maxVote = value;
        playerToLynch = key;
      }
    })

    // Update the lynched player
    game.players = game.players.map(player => {
      if (player.id === playerToLynch) {
          return { ...player, isAlive: false };
      }
      return player;
  });

    // Réinitialiser les votes pour le prochain tour
    game.votes = [];
    game.isNight = true
    game.status = "Tour_Du_LoupGarou"

     // Écrire le jeu mis à jour dans le fichier
    writeGameToFile(game);
    console.log(`le joueur ${playerToLynch} a été lynché`);
   }
   
   res.send({code: 200, message:'Vote submitted'});
}