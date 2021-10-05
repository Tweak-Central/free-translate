const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const compression = require("compression");

const log = require("log4js").getLogger("freelate");
const logger = require("./config/httpLogger");

const createRoutes = require("./routes");
const sequelize = require("./models");

(async () => {
    const port = process.env.PORT;
    const app = new express();

    log.info("Syncing database...");
    app.set("sequelize", sequelize);
    await sequelize.sync();

    app.use(logger);
    app.use(cors());
    app.use(fileUpload({ createParentPath: true }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(compression());

    createRoutes(app);

    app.listen(port, () => {
        log.info(`INFO: Listening on port ${port}`);
    });
})();
