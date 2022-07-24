const Sauce = require("../models/Sauce")

// const createSauce = (req, res, next) => {
//     const sauce = new Sauce({
//         userId: tarte,
//         name: tarte,
//         manufacturer: tarte,
//         description: tarte,
//         mainPepper: tarte,
//         imageUrl: tarte,
//         heat: 2,
//         likes: 2,
//         dislikes: 2,
//         usersLikes: tarte,
//         usersDislikes: tarte
//     });
//     sauce.save()
//         .then((res) => console.log("sauce enregistrée", res))
//         .catch(console.error);
// };

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
        .then(() => res.status(201).json({ message: "Objet enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
};


exports.displayAllSauces = (req, res, next)=>{
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.displayOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};
