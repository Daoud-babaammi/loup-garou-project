const express = require("express");
const router = express.Router({mergeParams: true});

const { sorciereActions, chasseurActions, loupGarouActions, loupGarouInfo, voyantsActions, cupidonActions } = require("../controller/action.controller");

router.post('/sorcier', sorciereActions);

router.post('/chasseur', chasseurActions);

router.post('/loupgarou', loupGarouActions);

router.get('/loupInfo', loupGarouInfo);

router.post('/voyants', voyantsActions);

router.post('/cupidon', cupidonActions)

module.exports = router;