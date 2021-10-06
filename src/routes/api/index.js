const { Router } = require("express");
const errors = require("../../errors");

const languages = require("./languages");
const user = require("./user");
const project = require("./project");

const route = Router();

// Handle API requests
route.get("/", (req, res) => {
    res.status(200).json({
        status: "online",
    });
});

route.get("/languages", languages);

route.use("/user", user);
route.use("/project", project);

// 404
route.all("/*", (req, res) => {
    res.status(404).json({
        success: false,
        ...errors.getError(404),
    });
});

module.exports = route;
