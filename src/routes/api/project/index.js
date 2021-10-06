const { Router } = require("express");
const { isLoggedIn } = require("../../../middleware/user");
const projectMiddleware = require("../../../middleware/project");

const file = require("./file");

const create = require("./create");

const route = Router();

route.use("/:projectId/file", file);

route.post("/create", isLoggedIn, projectMiddleware.validateCreation, create);

module.exports = route;
