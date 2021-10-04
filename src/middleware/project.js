const errors = require("../errors");

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
};
