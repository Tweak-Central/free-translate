const path = require("path");
const log4js = require("log4js");

const devMode = (process.env.NODE_ENV || "development") == "development";

const logPath = path.join(__dirname, "../../", "logs");
const logLevel = devMode ? "debug" : "info";

log4js.configure({
    appenders: {
        access: {
            type: "file",
            filename: path.join(logPath, "access.log"),
        },
        database: {
            type: "file",
            filename: path.join(logPath, "db.log"),
        },
        log: {
            type: "file",
            filename: path.join(logPath, "freelate.log"),
        },
        console: {
            type: "stdout",
        },
    },
    categories: {
        default: {
            appenders: ["log", "console"],
            level: logLevel,
        },
        server: {
            appenders: ["access", "console"],
            level: logLevel,
        },
        database: {
            appenders: ["database"],
            level: logLevel,
        },
    },
});

module.exports = {
    level: devMode ? "debug" : "info",
    path: logPath,
};
