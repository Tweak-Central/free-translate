const jwt = require("jsonwebtoken");
const errors = require("../errors");
const validators = require("../validators");
const jwtSecret = process.env.JWT_SECRET || "freelate001$$";

module.exports = {
    validateRegister(req, res, next) {
        if (!req.body.username || req.body.username.length < 3) {
            return errors.resError(
                res,
                errors.getError(400, "Please enter a username with min. 3 chars")
            );
        }

        if (!req.body.email || !validators.email(req.body.email)) {
            return errors.resError(res, errors.getError(400, "Please enter a valid email address"));
        }

        if (!req.body.password || req.body.password.length < 8) {
            return errors.resError(
                res,
                errors.getError(400, "Please enter a password with min. 8 chars")
            );
        }

        if (!req.body.passwordRepeat || req.body.password !== req.body.passwordRepeat) {
            return errors.resError(res, errors.getError(400, "Both passwords have to match"));
        }

        next();
    },
    isLoggedIn(req, res, next) {
        try {
            const loginToken = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(loginToken, jwtSecret);
            req.user = decoded;
            next();
        } catch (err) {
            return errors.resError(res, errors.getError(401, "Invalid session."));
        }
    },
};
