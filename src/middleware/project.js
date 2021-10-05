const errors = require("../errors");
const { models } = require("../models");
const { Op } = require("sequelize");

const userMiddleware = require("./user");

module.exports = {
    validateCreation(req, res, next) {
        if (!req.body.name || req.body.name.length < 2) {
            return errors.resError(
                res,
                errors.getError(400, "Please enter a project name with min. 2 chars")
            );
        }

        if (!req.body.description || req.body.description.length < 10) {
            return errors.resError(
                res,
                errors.getError(400, "Please enter a project description with min. 10 chars")
            );
        }

        if (!req.body.mode || !["single", "multi"].includes(req.body.mode)) {
            return errors.resError(res, errors.getError(400, "Please select a valid mode"));
        }

        if (req.body.mode == "multi") {
            return errors.resError(
                res,
                errors.getError(400, "The multi-file mode ist still in development")
            );
        }

        next();
    },
    validateUserAccess(requiredLevel) {
        return [
            userMiddleware.isLoggedIn,
            async (req, res, next) => {
                const perm = await models.Permission.findOne({
                    where: {
                        user: req.user.get("id"),
                        accessLevel: { [Op.gte]: requiredLevel },
                        project: req.body.project,
                    },
                });
                if (!perm) {
                    return errors.resError(
                        res,
                        errors.getError(401, "You do not have access to the provided project")
                    );
                }
                next();
            },
        ];
    },
};
