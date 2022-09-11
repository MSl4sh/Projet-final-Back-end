const router = require('express').Router();
const authController = require ('../controllers/auth.controller')
const userController = require ('../controllers/user.controller')
const uploadController= require ('../controllers/upload.controller')
const multer = require ('multer')
const upload = multer()

//routes d'authentification:
router.post('/register', authController.signUp); //inscription d'un nouvel utilisateur.
router.post('/login', authController.logIn); // connection d'un utilisateur.
router.get('/logout', authController.logOut) // déconnection d'un utilisateur.

//routes C.R.U.D d'utilisateurs:
router.get('/', userController.getAll); //récupère tout les utilsateurs.
router.get('/:id', userController.getById); // récupère un utilisateur grâce à son ID.
router.put('/:id', userController.update); // modification des données d'un utilisateur par son ID.
router.delete('/:id', userController.delete); // supprimer un utilisateur grâce à son ID.
router.patch('/follow/:id', userController.follow); // Récupère les follows d'un utilisateur grâce à son ID.
router.patch('/unfollow/:id', userController.unfollow); // Supprime un follow de l'utilisateur grâce à son ID.

//routez d'upload d'images:

router.post('/upload',upload.single('file'),uploadController.uploadProfil)

module.exports = router;