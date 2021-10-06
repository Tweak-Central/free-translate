const { Router } = require("express");
const projectMiddleware = require("../../../../middleware/project");
const fileMiddleware = require("../../../../middleware/file");

const upload = require("./upload");
const list = require("./list");
const translations = require("./languages");

const route = Router({ mergeParams: true });

route.post("/upload", projectMiddleware.validateUserAccess(3), upload);
route.get("/list", projectMiddleware.validateUserAccess(), list);
route.get("/:fileId/languages", fileMiddleware.fileExists, translations);

module.exports = route;
