const winston = require("winston");
require("express-async-errors");

module.exports = function () {
    const logger = winston.createLogger({
        transports: [ 
            new winston.transports.Console({
                colorize: true,
                prettyPrint: true
            }),
            new winston.transports.File({
                filename: 'logFile.log'
            })
        ],
        //* Handel uncaught exceptions
        exceptionHandlers: [
            new winston.transports.Console({
                colorize: true,
                prettyPrint: true
            }),
            new winston.transports.File({
                filename: 'logFile.log'
            })
        ],
         // * Handel unhandled rejections
        rejectionHandlers: [
            new winston.transports.Console({
                colorize: true,
                prettyPrint: true
            }),
            new winston.transports.File({
                filename: 'logFile.log'
            })
        ]

    });


    winston.add(logger);
};