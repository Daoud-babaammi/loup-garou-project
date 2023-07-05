const express = require('express')
const { gameInfosController, voteController, loginController, startController } = require('../controller/game.controller')

const router = express.Router({mergeParams: true})

router.get('/gameInfo', gameInfosController)

router.post('/vote', voteController);

router.post('/start', startController)

module.exports = router