const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");

const createRoutes = require("./routes");
const sequelize = require("./models");

(async () => {
    const port = process.env.PORT;
    const app = new express();

    app.set("sequelize", sequelize);
    await sequelize.sync({ alter: true });

    app.use(morgan("tiny"));
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(compression());

    createRoutes(app);

    app.listen(port, () => {
        console.log(`INFO: Listening on port ${port}`);
    });
})();
