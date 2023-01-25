const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
    await mongoose.connect(process.env.URL_DB);
    console.log("Connected DB!");
};

main().catch(err => console.log(err));

module.exports = mongoose;