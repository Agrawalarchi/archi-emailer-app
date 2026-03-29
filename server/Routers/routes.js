const { sendingEmail, fillEntries, getEnteries } = require('../Controllers/utilityController');
const router = require('express').Router();



router.post("/enteries", fillEntries);

router.post("/send", sendingEmail);

router.get("/", getEnteries);

module.exports = router;