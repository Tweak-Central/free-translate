const { models } = require("../models");
const errors = require("../errors");
const projectMiddleware = require("./project");

module.exports = {
    fileExists: [
        projectMiddleware.validateUserAccess(),
        async (req, res, next) => {
            const file = await models.File.findOne({
                where: {
                    id: req.params.fileId,
                },
            });
            if (!file)
                return errors.resError(
                    res,
                    errors.getError(404, "The specified project was not found")
                );

            req.file = file;

            next();
        },
    ],
};
