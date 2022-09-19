const UserModel = require('../models/user.model');
const fs = require('fs')// dépendence native de gestion de fichier "file system".
const { promisify } = require('util');
const { uploadError } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline);
const { PORT } = process.env
const streamifier = require('streamifier')
const {Readable} = require('stream')

const uploadController = {
    uploadProfil: async (req, res) => {
        console.log("body",req.body)
        console.log("file",req.file)

        try {
            if (req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png")// vérification que l'image proposée soit bien au format "jpg","jpeg" ou "png".
                throw Error("Format d'image non supporté")
            if (req.file.size > 5000000) throw Error("Fichier trop volumineux.")// vérification du poids de l'image.
        } catch (err) {
            const error = uploadError(err)// Appel de la fonction uploadError (utils)
            return res.status(201).json({ error })
        }

        const imgName = new Date().getTime()+"-"+req.body.name+".jpg";

        // await pipeline(
        //     req.file.stream,
        //     fs.createWriteStream(
        //         `../client/public/uploads/profil/${imgName}`//Url du dossier de stockage des images.
        //     )
        // );
        const stream = fs.createWriteStream(
            `./public/uploads/profil/${imgName}`//Url du dossier de stockage des images.
        )
        streamifier.createReadStream(req.file.buffer).pipe(stream)
        try {
            await UserModel.findByIdAndUpdate(
                req.body.userId,
                { $set: { img: `uploads/profil/${imgName}` } },// envoi de l'url de l'image dans le champs "img" de l'utilisateur.
                { new: true, upsert: true, setDefaultsOnInsert: true },
                (err, docs) => {
                    if (!err) return res.send(docs);
                    // else return res.status(500).send({ message: err })
                }

            )
        } catch (err) {
            // return res.status(500).send({ message: err })
        }
    }
}

module.exports = uploadController