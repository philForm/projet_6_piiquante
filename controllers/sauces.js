const fs = require("fs");

const Sauce = require("../models/Sauce");

// Création d'une nouvelle sauce.
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    })
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
        .catch((error) => res.status(400).json({ error }));
};

// Affiche toutes les sauces.
exports.displayAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Affiche une seule sauce.
exports.displayOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};


// Supprime une sauce
exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};


// Modifie une sauce.
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body }
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch(error => res.status(400).json({ error }));
};

// Voter pour une sauce !
exports.likedSauce = (req, res, next) => {
    const likedSauce = req.body
    const { userId, like } = likedSauce
    console.log(`userId : ${userId}`)
    console.log(`like : ${like}`)
    console.log(req.params.id)
    console.log({
        ...likedSauce
    });
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            res.status(200).json({ sauce });
            console.log(sauce);
            if (like === 1
                && !sauce.usersLiked.find(el => el === userId)
            ) {
                if (sauce.usersDisliked.find(el => el === userId)) {
                    sauce.dislikes -= 1
                    sauce.usersDisliked = sauce.usersDisliked.filter(el => el != userId);
                }
                sauce.usersLiked.push(userId);
                sauce.likes += 1
                sauce.save();
            }

            if (like === -1
                && !sauce.usersDisliked.find(el => el === userId)
            ) {
                if (sauce.usersLiked.find(el => el === userId)) {
                    sauce.likes -= 1
                    sauce.usersLiked = sauce.usersLiked.filter(el => el != userId);
                }
                sauce.usersDisliked.push(userId)
                sauce.dislikes += 1;
                sauce.save();

            }

            if (like === 0 && sauce.usersLiked.find(el => el === userId)) {
                // sauce.likes = 0
                sauce.likes -= 1
                sauce.usersLiked = sauce.usersLiked.filter(el => el != userId);
                sauce.save();
            }
            if (like === 0 && sauce.usersDisliked.find(el => el === userId)) {
                // sauce.dislikes = 0
                sauce.dislikes -= 1
                sauce.usersDisliked = sauce.usersDisliked.filter(el => el != userId);
                sauce.save();
            }
        })
        .catch(error => res.status(400).json({ error }));

}