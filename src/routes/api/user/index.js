const { Router } = require("express");
const userMiddleware = require("../../../middleware/user");
const login = require("./login");
const register = require("./register");

const route = Router();

route.post("/login", register);
route.post("/register", userMiddleware.validateRegister, register);

module.exports = route;
