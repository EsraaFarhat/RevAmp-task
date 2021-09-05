const winston = require('winston');
const express = require('express');

const app = express();


require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();


if (!process.env.jwtPrivateKey) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
}


const port = process.env.PORT || 3000;
app.listen(port, () => {
    winston.info(`listening on port ${port}...`);
});