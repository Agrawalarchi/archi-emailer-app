const express = require('express');
const app = express();
const Router = require('./Routers/routes.js')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());    

app.listen(8080, ()=>{
    console.log("listening");

})

app.use("/", Router);

module.exports = app;