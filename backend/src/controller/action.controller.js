const { writeGameToFile, readGameFromFile } = require("../helper/game");
const { checkLinkedUser } = require("../helper/roles");

// last player Action for is a life
exports.sorciereActions = (req, res, next) => {
  const { idGame, idPlayer } = req.params;
  const { action, targetPlayerId } = req.body;
  const game = readGameFromFile(idGame);
  let players = game.players;

  const sorciere = game.players.find(
    (player) => player.role === "Sorciere" && player.id === idPlayer
  );
  console.log(sorciere)
  if (!sorciere) {
    res
      .status(404)
      .send({ code: 400, message: "Sorcière introuvable ou morte" });
    return;
  }

  // Vérifier si la Sorcière a déjà utilisé ses potions
  if (!sorciere.isHealingUsable && !sorciere.isKillingUsable) {
    res
      .status(400)
      .send({ code: 400, message: "Les potions ont déjà été utilisées" });
    return;
  }

  if (action === "heal") {
    // Utiliser la potion de guérison
    if (game.lastPlayerKilledId && sorciere.isHealingUsable) {
      const playerToHeal = game.players.find(
        (player) => player.id === game.lastPlayerKilledId
      );

      if (playerToHeal) {
        playerToHeal.isAlive = true;
        sorciere.isHealingUsable = false;

        players = game.players.map((value) => {
          if (value.id === playerToHeal.id) {
            return playerToHeal;
          }

          if (value.id === sorciere.id) {
            return sorciere;
          }

          return value;
        });
      } else {
        res
          .status(404)
          .send({ code: 400, message: "Joueur à soigner introuvable" });
        return;
      }
    }
  } else if (action === "kill") {
    // Utiliser la potion de poison
    if (targetPlayerId && sorciere.isKillingUsable) {
      const playerToPoison = game.players.find(
        (player) => player.id === targetPlayerId
      );
      if (playerToPoison) {
        playerToPoison.isAlive = false;
        sorciere.usedPoisonPotion = false;
        game.lastPlayerKilledId = targetPlayerId;

        players = game.players.map((value) => {
          if (value.id === playerToPoison.id) {
            return playerToPoison;
          }

          if (value.id === sorciere.id) {
            return sorciere;
          }

          return value;
        });
      } else {
        res
          .status(404)
          .send({ code: 400, message: "Joueur à empoisonner introuvable" });
      }
    }
  }

  if (
    game.players.find(
      (value) =>
        value.id === game.lastPlayerKilledId && value.role === "Chasseur"
    )
  ) {
    game.status = "Tour_Du_Chasseur";
    game.isNight = false;
    game.players = players;
  } else {
    game.players = checkLinkedUser(players, game.lastPlayerKilledId);
    game.isNight = false;
    game.status = "Tour_Des_Delibiration";
  }

  writeGameToFile(game);
  res.send({ code: 200, message: "Actions de la Sorcière effectuées" });
};

// first Actions in the night
exports.loupGarouActions = (req, res, next) => {
  const { idGame, idPlayer } = req.params;
  const { targetPlayerId } = req.body;
  const game = readGameFromFile(idGame);
  // Code to eliminate target player by werewolf

  if (
    !game.players.find(
      (value) => value.id === idPlayer && value.role === "LoupGarou"
    )
  ) {
    res.send({ code: 400, message: "not authorize for this actions" });
    return
  }

  const playersAlive = game.players.filter((value) => value.isAlive === true);

  const playersUpdate = game.players.map((value) => {
    if (value.id === targetPlayerId) {
      game.lastPlayerKilledId = value.id;

      return {
        ...value,
        isAlive: false,
      };
    }

    return value;
  });

  game.players = playersUpdate;

  if (playersAlive.find((value) => value.role === "Voyante")) {
    game.status = "Tour_De_La_Voyants";
  } else if (playersAlive.find((value) => value.role === "Sorciere")) {
    game.status = "Tour_De_La_Sorciers";
  } else if (
    game.players.find(
      (value) =>
        value.id === game.lastPlayerKilledId && value.role === "Chasseur"
    )
  ) {
    game.players = checkLinkedUser(game.players, game.lastPlayerKilledId);
    game.status = "Tour_Du_Chasseur";
    game.isNight = false;
  } else {
    game.players = checkLinkedUser(game.players, game.lastPlayerKilledId);
    game.isNight = false;
    game.status = "Tour_Des_Delibiration";
  }

  writeGameToFile(game);

  res.send({ code: 200, status: "Action processed" });
};

// is use for is dead
exports.chasseurActions = (req, res, next) => {
  const { targetPlayerId } = req.body;
  const game = readGameFromFile(idGame);
  // Code to eliminate target player by hunter

  const hunter = game.players.find(
    (player) => player.role === "chasseur" && player.isAlive
  );

  const targetPlayer = game.players.find(
    (player) => player.id === targetPlayerId
  );

  if (!hunter) {
    res.status(404).send({ error: "Hunter not found or not alive" });
    return;
  }

  if (targetPlayer && hunter.isAlive === false) {
    // Kill the target player
    targetPlayer.isAlive = false;

    const modifyPlayer = game.players.map((value) => {
      if (value.id === targetPlayer.id) {
        return targetPlayer;
      }

      return value;
    });

    game.lastPlayerKilledId = targetPlayerId;
    // Check which role should have the next turn
    game.players = checkLinkedUser(modifyPlayer, game.lastPlayerKilledId);
    game.isNight = false;
    game.status = "Tour_Des_Delibiration";
    writeGameToFile(game);
    res.send({ code: 200, message: "Hunter took someone down with them" });
  } else {
    res
      .status(404)
      .send({ error: "Target player not found or hunter is still alive" });
  }
};

// is call tout player is life
exports.loupGarouInfo = (req, res, next) => {
  res.send({ werewolves: "List of werewolves" });
};

// second Action
exports.voyantsActions = (req, res, next) => {
  const { idGame } = req.params;
  const { targetPlayerId } = req.body;
  const game = readGameFromFile(idGame);

  const player = game.players.find((player) => player.id === targetPlayerId);

  if (player) {
    // Check which role should have the next turn
    const playersAlive = game.players.filter((player) => player.isAlive);
    if (playersAlive.find((value) => value.role === "Sorciere")) {
      game.status = "Tour_De_La_Sorciers";
    } else if (
      game.players.find(
        (value) =>
          value.id === game.lastPlayerKilledId && value.role === "Chasseur"
      )
    ) {
      game.players = checkLinkedUser(game.players, game.lastPlayerKilledId);
      game.status = "Tour_Du_Chasseur";
      game.isNight = false;
    } else {
      game.players = checkLinkedUser(game.players, game.lastPlayerKilledId);
      game.isNight = false;
      game.status = "Tour_Des_Delibiration";
    }
    writeGameToFile(game);
    res.send({ code: 200, role: player.role });
  } else {
    res.status(404).send({ code: 400, error: "Player not found" });
  }
};

//
exports.cupidonActions = (req, res, next) => {
  const { idGame, idPlayer } = req.params;
  const game = readGameFromFile(idGame);
  const { firstLoverId, secondLoverId } = req.body;

  const firstLover = game.players.find((player) => player.id === firstLoverId);
  const secondLover = game.players.find(
    (player) => player.id === secondLoverId
  );

  if (firstLover && secondLover) {
    // Make the two players lovers
    firstLover.loverId = secondLoverId;
    secondLover.loverId = firstLoverId;
    players = game.players.map((value) => {
      if (value.id === firstLoverId) {
        return firstLover;
      }

      if (value.id === secondLoverId) {
        return secondLover;
      }

      return value;
    });
    game.status = "Tour_Du_LoupGarou";
    writeGameToFile(game);
    res.send({ code: 200, message: "Lovers have been selected" });
  } else {
    res
      .status(404)
      .send({ code: 400, message: "One or both players not found" });
  }
};
