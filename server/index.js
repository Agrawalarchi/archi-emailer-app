const express = require('express');
const app = express();
const Router = require('./Routers/routes.js');
const cors = require('cors');
const { set } = require('mongoose');
const {setDbConnection} = require("./Models/database.js");
require('dotenv').config();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());    
app.use(cors({origin:process.env.FRONTEND_LINK_STRING, credentials:true}))


setDbConnection().then(()=>{
   app.listen(8080, ()=>{
    console.log("listening");
   })
})
.catch((err)=>{
    console.error("Failed to connect to database:", err);
    process.exit(1);
})



app.use("/", Router);

module.exports = app;