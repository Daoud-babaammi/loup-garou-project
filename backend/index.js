const express = require("express");
const http = require('http');
const cors = require('cors');

const app = express();
const { logMiddelware } = require("./src/middelware/logMiddelware");

app.use(cors());

app.use(express.json())

// Middleware pour parser les données du corps des requêtes
app.use(express.urlencoded({ extended: true }));

const actionRouter = require('./src/routes/action.routes')
app.use("/game/action/:idGame/:idPlayer",[logMiddelware], actionRouter);

const gameRouter = require('./src/routes/game.routes')
app.use("/game/:idGame/:idPlayer", [logMiddelware], gameRouter);

const { loginController } = require('./src/controller/game.controller');
app.post("/game/login", [logMiddelware], loginController)
// Démarrer le serveur
const port = process.env.PORT || 3001;
const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});