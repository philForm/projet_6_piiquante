const fs = require("fs");

const Sauce = require("../models/Sauce");

/**
 * Création d'une nouvelle sauce.
 */
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

/**
 * Affiche toutes les sauces.
 */
exports.displayAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

/**
 * Affiche une seule sauce.
 */
exports.displayOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

/**
 * Supprime une sauce
 */
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

/**
 * Modifie une sauce.
 */
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

/**
 * Voter pour une sauce !
 */
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
            console.log(sauce);

            let message
            // Si like = 1 et si l'utilisateur n'a pas déjà liked la sauce
            if (like === 1
                && !sauce.usersLiked.find(el => el === userId)
            ) {
                removeUserIdAndLike(sauce.usersDisliked, sauce.dislikes, userId);
                sauce.usersLiked.push(userId);
                sauce.likes += 1;
                message = "évaluée"
            }

            if (like === -1
                && !sauce.usersDisliked.find(el => el === userId)
            ) {
                removeUserIdAndLike(sauce.usersLiked, sauce.likes, userId)
                sauce.usersDisliked.push(userId)
                sauce.dislikes += 1;
                message = "dévaluée"
            }

            if (like === 0 && sauce.usersLiked.find(el => el === userId)) {
                sauce.likes -= 1
                sauce.usersLiked = sauce.usersLiked.filter(el => el != userId);
                message = "évaluation retirée !"
            }
            if (like === 0 && sauce.usersDisliked.find(el => el === userId)) {
                sauce.dislikes -= 1
                sauce.usersDisliked = sauce.usersDisliked.filter(el => el != userId);
                message = "dévaluation retirée !"
            }
            return [sauce, message];
        })
        .then(([sauce, message]) => {
            res.status(200).json({
                sauce,
                message
            });
            sauce.save();
        })
        .catch(error => res.status(400).json({ error }));

}
/**
 * Si l'utilisateur a déjà mis un like ou dislike, l'information est retirée.
 */
const removeUserIdAndLike = (sauceUserLike, sauceLike, userId) => {
    if (sauceUserLike.find(el => el === userId)) {
        sauceLike -= 1;
        sauceUserLike = sauceUserLike.filter(el => el != userId);
    };
};
