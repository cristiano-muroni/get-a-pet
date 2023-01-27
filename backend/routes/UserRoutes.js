const router = require('express').Router();
const UserControler = require('../controllers/UserController');
const User = require('../models/User');

router.post('/register', UserControler.register);
router.post('/login', UserControler.login);
router.get('/checkuser', UserControler.checkUser);

module.exports = router;