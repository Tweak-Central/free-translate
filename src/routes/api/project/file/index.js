const { Router } = require("express");
const projectMiddleware = require("../../../../middleware/project");
const fileMiddleware = require("../../../../middleware/file");

const upload = require("./upload");
const list = require("./list");
const translations = require("./translations");

const route = Router({ mergeParams: true });

route.post("/upload", projectMiddleware.validateUserAccess(3), upload);
route.get("/list", projectMiddleware.validateUserAccess(), list);
route.get("/:fileId/translations", fileMiddleware.fileExists, translations);

module.exports = route;
