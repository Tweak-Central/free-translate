const { Router } = require("express");
const { isLoggedIn } = require("../../../middleware/user");

const create = require("./create");

const route = Router();

route.post("/create", isLoggedIn, create);

module.exports = route;
