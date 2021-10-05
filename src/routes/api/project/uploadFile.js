const errors = require("../../../errors");
const { models } = require("../../../models");
const sequelize = require("sequelize");

module.exports = async (req, res) => {
    if (!req.files || !req.files.sources)
        return errors.resError(res, errors.getError(400, "Please upload the sources file"));

    const sourcesFile = req.files.sources;
    const projectId = req.body.project || null;

    if (sourcesFile.mimetype !== "application/json")
        return errors.resError(res, errors.getError(400, "The sources file must be of type json"));

    const project = await models.Project.findOne({ where: { id: projectId } });
    if (!project)
        return errors.resError(res, errors.getError(400, "Please specify a valid project"));

    let file = await models.File.findOne({
        where: { project: project.get("id"), name: sourcesFile.name },
    });

    let keys = [];
    try {
        function parseKeys(source, key = null) {
            let keys = [];

            for (let a in source) {
                if (a.includes(".")) throw new Error("The keys are not allowed to contain dots");

                let currentKey = (key ? key + "." : "") + a;

                if (typeof source[a] == "object") {
                    keys.push(...parseKeys(source[a], currentKey));
                } else {
                    const parts = currentKey.split(/\.(.+)/, 2);
                    keys.push({
                        key: parts[1],
                        language: parts[0],
                    });
                }
            }
            return keys;
        }
        keys = parseKeys(JSON.parse(sourcesFile.data));
    } catch (err) {
        return errors.resError(res, errors.getError(400, err.message));
    }

    if (!file)
        file = await models.File.create({
            project: project.get("id"),
            name: sourcesFile.name,
        });

    for (let translation of keys) {
        translation.project = project.get("id");
        translation.file = file.get("id");
        translation.author = req.user.get("id");
        translation.created = sequelize.fn("NOW");
        translation.approved = req.user.get("id");
        translation.approvedOn = sequelize.fn("NOW");
    }

    await models.Translation.bulkCreate(keys);

    await res.json({
        success: true,
        translations: {
            file: file.get("id"),
            amount: keys.length,
        },
    });
};
