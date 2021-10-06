const { Router } = require("express");
const projectMiddleware = require("../../../../middleware/project");

const upload = require("./upload");
const list = require("./list");

const route = Router();

route.post("/upload", projectMiddleware.validateUserAccess(3), upload);
route.get("/list", projectMiddleware.validateUserAccess(), list);

module.exports = route;
