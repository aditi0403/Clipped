const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.static('public'));

const proxyRoute = require('./rembg-proxy');
app.use('/', proxyRoute);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
