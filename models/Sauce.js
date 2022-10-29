const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true, unique: false },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0, required: false },
    dislikes: { type: Number, default: 0, required: false },
    usersLiked: { type: Array, default: [], required: false },
    usersDisliked: { type: Array, default: [], required: false }

});

sauceSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Sauce", sauceSchema);