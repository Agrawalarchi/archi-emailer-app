const { sendingEmail } = require('../Controllers/utilityController');
const router = require('express').Router();




router.post("/", sendingEmail);


module.exports = router;