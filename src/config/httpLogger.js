const morgan = require("morgan");
const config = require("./loggerConfig");
const log4js = require("log4js");

const devMode = (process.env.NODE_ENV || "development") == "development";

const logger = log4js.getLogger("server");
const httpLogger = morgan(devMode ? "dev" : "common", {
    stream: {
        write: (str) => logger.info(str),
    },
});

module.exports = httpLogger;
