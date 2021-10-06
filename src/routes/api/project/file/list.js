const { models } = require("../../../../models");

module.exports = async (req, res) => {
    const project = req.project;

    const files = await models.File.findAll({
        attributes: ["id", "name", "mode"],
        where: {
            project: project.get("id"),
        },
    });

    res.json({
        success: true,
        files: files,
    });
};
