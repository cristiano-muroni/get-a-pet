const User = require('../models/User');
const bcrypt = require('bcrypt');
const createUserToken = require('../helpers/create-user-token');

module.exports = class UserControler {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body;

        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório'})
            return
        }
        if(!email) {
            res.status(422).json({message: 'O email é obrigatório'})
            return
        }
        if(!phone) {
            res.status(422).json({message: 'O telefone é obrigatório'})
            return
        }
        if(!password) {
            res.status(422).json({message: 'A senha é obrigatória'})
            return
        }
        if(!confirmpassword) {
            res.status(422).json({message: 'A confirmação de senha é obrigatória'})
            return
        }
        if(confirmpassword !== password) {
            res.status(422).json({message: 'a senha deve ser igual a confirmação de senha'});
            return
        }
        const userExists = await User.findOne({email: email});
        if(userExists) {
            res.status(422).json({message: 'Por favor , utilize outro email'})
            return
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        });

        try {
            const newUser = await user.save();
            await createUserToken(newUser, req, res);
        } catch (error) {
            res.status(500).json({message: error});
        }
    };

    static async login(req, res) {
        const { email, password } = req.body;

        if(!email) {
            res.status(422).json({message: 'O email é obrigatório'})
            return
        }
        if(!password) {
            res.status(422).json({message: 'A senha é obrigatória'})
            return
        }

        const user = await User.findOne({email: email});
        if(!user) {
            res.status(422).json({
                message: 'Não existe usuário com este e-mail',
            });
            return;
        };

        const checkPassword = await bcrypt.compare(password, user.password);
        if(!checkPassword) {
            res.status(422).json({
                message: 'Senha inválida!',
            });
            return;
        };
        await createUserToken(user, req, res);
        
    };
};