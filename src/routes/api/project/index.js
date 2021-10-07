const { Router } = require("express");
const { isLoggedIn } = require("../../../middleware/user");
const projectMiddleware = require("../../../middleware/project");

const create = require("./create");
const list = require("./list");

const file = require("./file");

const route = Router();

route.post("/create", isLoggedIn, projectMiddleware.validateCreation, create);
route.get("/list", isLoggedIn, list);

route.use("/:projectId/file", file);

module.exports = route;
