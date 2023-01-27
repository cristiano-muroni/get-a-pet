const router = require('express').Router();
const UserControler = require('../controllers/UserController');

router.post('/register', UserControler.register);
router.post('/login', UserControler.login);

module.exports = router;