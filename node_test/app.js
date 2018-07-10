/**
 * general setting
 */
const express = require("express");
const app = express();
app.set("view engine", 'ejs');

/**
 * modules import
 */
const routes = require("./route")



/**
 * check out data page
 */
app.get("/", routes.test);

app.get("/check", routes.checkoutData);

app.listen("8080", ()=>{
    console.info("server is running")
});