const jwt = require('jsonwebtoken');
const User =  require('../models/User');
require('dotenv').config();

const getUserByToken = async (token)=> {
    if(!token){
        return resizeBy.status(401).json({message: 'Acesso negado!'});
    };
    const decoded = jwt.verify(token, process.env.OUR_SECRET);
    const userId = decoded.id;
    const user = await User.findOne({_id: userId});

    return user;
};

module.exports = getUserByToken;