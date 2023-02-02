const router = require('express').Router();
const UserControler = require('../controllers/UserController');
const verifyToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/image-upload');

router.post('/register', UserControler.register);
router.post('/login', UserControler.login);
router.get('/checkuser', UserControler.checkUser);
router.get('/:id', UserControler.getUserById);
router.patch('/edit/:id', verifyToken, imageUpload.single("image"), UserControler.editUser);

module.exports = router;