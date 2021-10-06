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

        if (req.body.mode == "multi") {
            return errors.resError(
                res,
                errors.getError(400, "The multi-file mode ist still in development")
            );
        }

        if (typeof req.body.private != "boolean") {
            return errors.resError(
                res,
                errors.getError(400, "Please select the visibility of your project")
            );
        }

        if (!req.body.sourceLanguage) {
            return errors.resError(
                res,
                errors.getError(400, "Please enter the source language of your project")
            );
        }

        next();
    },
    validateUserAccess(requiredLevel = null) {
        return [
            userMiddleware.isLoggedIn,
            async (req, res, next) => {
                const perm = await models.Permission.findOne({
                    where: {
                        user: req.user.get("id"),
                        project: req.params.projectId,
                    },
                });
                const project = await models.Project.findOne({
                    where: {
                        id: req.params.projectId,
                    },
                });
                req.project = project;

                if (!project)
                    return errors.resError(
                        res,
                        errors.getError(404, "The specified project was not found")
                    );

                if (requiredLevel == null) {
                    if (project.get("private") && perm.get("accessLevel") < 1) {
                        return errors.resError(
                            res,
                            errors.getError(401, "You do not have access to the provided project")
                        );
                    }
                    next();
                } else {
                    if (!perm || perm.get("accessLevel") < requiredLevel) {
                        return errors.resError(
                            res,
                            errors.getError(401, "You do not have access to the provided project")
                        );
                    }
                    next();
                }
            },
        ];
    },
};
