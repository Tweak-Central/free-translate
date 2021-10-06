const { Router } = require("express");
const projectMiddleware = require("../../../../middleware/project");

const upload = require("./upload");

const route = Router();

route.post("/upload", projectMiddleware.validateUserAccess(3), upload);

module.exports = route;
