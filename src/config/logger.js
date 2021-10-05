const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const path = require("path");

const devMode = (process.env.NODE_ENV || "development") == "development";

const accessLogStream = rfs.createStream("access.log", {
    interval: "1d",
    path: path.join(__dirname, "../../", "logs"),
});

const logger = morgan(devMode ? "dev" : "common", {
    stream: accessLogStream,
});

module.exports = logger;
