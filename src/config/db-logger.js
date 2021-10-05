const path = require("path");
const { createLogger, transports } = require("winston");
const fs = require("fs");

const devMode = (process.env.NODE_ENV || "development") == "development";
const logPath = path.join(__dirname, "../../", "logs");

fs.existsSync(logPath) || fs.mkdirSync(logPath);

const logger = createLogger({
    level: "info",
    transports: [
        new transports.File({
            filename: path.join(logPath, "db-error.log"),
            level: "error",
            handleExceptions: true,
            maxsize: 5242880,
        }),
        new transports.File({
            filename: path.join(logPath, "db.log"),
            handleExceptions: true,
            maxsize: 5242880,
        }),
    ],
});

module.exports = logger;
