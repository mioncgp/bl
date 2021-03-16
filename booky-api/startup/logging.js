const winston = require("winston");
// require('winston-mongodb');
require("express-async-errors");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  new winston.transports.File({ filename: "logfile.log", level: "error" });
  // winston.add(winston.transports.MongoDB, {
  //   db: 'mongodb://localhost/bookyleaks',
  //   level: 'info'
  // });
};
