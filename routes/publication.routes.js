const router = require('express').Router();
const publicationController = require('../controllers/publication.controller')
const multer = require ('multer')
const upload = multer()


//routes de publications.

router.get('/', publicationController.readPublication);//Lire toutes les publications.
router.post('/',upload.single('file'), publicationController.createPublication);//Créer une nouvelle publication.
router.put('/:id', publicationController.updatePublication);//Modifier une publication par son Id.
router.delete('/:id', publicationController.deletePublication);//Supprimer une publication par son Id
router.patch('/like-publication/:id', publicationController.likePublication)//Liker une publication par son Id.
router.patch('/unlike-publication/:id', publicationController.unlikePublication)//Unliker une publication par son Id.


// routes des commentaires.

router.patch('/comment-post/:id', publicationController.commentPublication); // poster un commentaire via l'id d'une publication.
router.patch('/edit-comment/:id', publicationController.editCommentPublication);// editer un commentaire via son Id.
router.patch('/delete-comment/:id', publicationController.deleteCommentPublication);// supprimer un commentaire via son Id.



module.exports= router

