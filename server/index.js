const express = require('express');
const app = express();
const Router = require('./Routers/routes.js');
const cors = require('cors');
require('dotenv').config();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());    
app.use(cors({origin:process.env.FRONTEND_LINK_STRING, credentials:true}))
app.listen(8080, ()=>{
    console.log("listening");

})

app.use("/", Router);

module.exports = app;