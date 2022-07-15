const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;

const userRoutes = require("./routes/user");

// mongoose.connect(
//     `mongodb+srv://${dbUser}:${dbPassword}@cluster0.jhxcq.mongodb.net/?retryWrites=true&w=majority`,
//     { useNewUrlParser: true, useUnifiedTopology: true }
// ).then(() =>
//     console.log("Connexion à mongodb réussie !")
// ).catch(() =>
//     console.log("Connexion à mongodb échouée !!")
// );

// Se connecte à la Base de Données "piiquante" et la crée si elle n'existe pas !
mongoose.connect(
    "mongodb://localhost:27017/piiquante",
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connexion à mongodb réussie !"))
    .catch(() => console.log("Connexion à mongodb échouée !!"))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use("/api/auth", userRoutes);



module.exports = app;