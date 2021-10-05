const errors = require("../../../errors");
const { models } = require("../../../models");

module.exports = async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const mode = req.body.mode;

    const projectExists = await models.Project.findOne({
        where: { name: name },
    });

    if (projectExists) {
        return errors.resError(
            res,
            errors.getError(409, "A project with that name already exists")
        );
    }

    const newProject = await models.Project.create({
        name,
        description,
        mode,
    });

    await models.Permission.create({
        user: req.user.get("id"),
        project: newProject.get("id"),
        accessLevel: 6,
    });

    res.json({
        success: true,
        project: newProject.get(),
    });
};
