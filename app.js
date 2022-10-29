const express = require("express");
const helmet = require("helmet")
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// crossOriginResourcePolicy({ policy: "cross-origin" } : résout un problème de CORS des version 5 et supérieurs de helmet et qui bloque l'affichage des images dans le navigateur.
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");


// Se connecte à la Base de Données "piiquante" et la crée si elle n'existe pas !
mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.lsr3jb4.mongodb.net/?retryWrites=true&w=majority`,
    {
        // on ajoute un Objet de configuration
        useNewUrlParser: true,
        // évite une mise en garde dans la console
        useUnifiedTopology: true
    }
).then(() =>
    console.log("Connexion à mongodb atlas réussie !")
).catch(() =>
    console.log("Connexion à mongodb atlas échouée !!")
);

// Middleware qui empêche les erreurs CORS (Cross Origin Resource Sharing) et donne accès à l'API...
app.use((req, res, next) => {
    // ... à tous le monde sans restriction
    res.setHeader('Access-Control-Allow-Origin', '*');
    // ...en utilisant tous ces headers
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // ...et pour tout type de requête
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Transforme le corps de la requête en objet de données grâce à la méthode json() de body-parser qui est désormais integrée à express. (pour les requêtes POST et PUT)
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

// La méthode use prend deux arguments :
// la route de base et le router
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);


module.exports = app;