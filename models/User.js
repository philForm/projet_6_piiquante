const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    }
);

// Certifie qu'un email ne peut pas être utilisé par plusieurs utilisateurs.
userSchema.plugin(uniqueValidator);

// Dans la Base de Données, correspond à la Collection "users". Crée la Collection si elle n'existe pas.
module.exports = mongoose.model('User', userSchema);