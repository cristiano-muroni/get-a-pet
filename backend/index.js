const express = require('express');
const cors = require('cors');
const UserRoutes = require('./routes/UserRoutes');
const PetRoutes = require('./routes/PetRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.URL_CORS}))
app.use(express.static('public'));

app.use('/users', UserRoutes);
app.use('/pets', PetRoutes);

app.listen(port);