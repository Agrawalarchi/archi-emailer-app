const { sendingEmail, fillEntries } = require('../Controllers/utilityController');
const router = require('express').Router();



router.post("/enteries", fillEntries);

router.post("/send", sendingEmail);


module.exports = router;