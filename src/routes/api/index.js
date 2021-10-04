const { Router } = require("express");
const errors = require("../../errors");

const user = require("./user");

const route = Router();

// Handle API requests
route.get("/", (req, res) => {
    res.status(200).json({
        status: "online",
    });
});

route.use("/user", user);

// 404
route.all("/*", (req, res) => {
    res.status(404).json({
        success: false,
        ...errors.getError(404),
    });
});

module.exports = route;
