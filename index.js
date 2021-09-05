const winston = require('winston');
const express = require('express');

const app = express();


require('./startup/logging')();
require('./startup/db')();

const port = process.env.PORT || 3000;
app.listen(port, ()=> {
    winston.info(`listening on port ${port}...`);
});
