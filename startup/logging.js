const winston = require("winston");

module.exports = function () {
  //* Handel uncaught exceptions
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "logFile.log" })
  );

  // * Handel unhandled rejections
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));
  winston.add(new winston.transports.File({ filename: "logFile.log" }));
};
