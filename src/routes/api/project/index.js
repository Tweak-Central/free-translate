const { Router } = require("express");
const { isLoggedIn } = require("../../../middleware/user");
const projectMiddleware = require("../../../middleware/project");

const create = require("./create");
const uploadFile = require("./uploadFile");

const route = Router();

route.post("/create", isLoggedIn, projectMiddleware.validateCreation, create);
route.post("/file/upload", projectMiddleware.validateUserAccess(3), uploadFile);

module.exports = route;
