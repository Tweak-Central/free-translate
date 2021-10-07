const errors = require("../../../../errors");
const { models } = require("../../../../models");
const supportedLanguages = require("../../../../supportedLanguages.json");
const sequelize = require("sequelize");
const logger = require("log4js").getLogger("freelate");

module.exports = async (req, res) => {
    if (!req.files || !req.files.sources)
        return errors.resError(res, errors.getError(400, "Please upload a sources file"));

    const sourcesFile = req.files.sources;
    const projectId = req.params.projectId;
    const mode = req.body.mode;
    const overwrite = req.body.overwrite ? req.body.overwrite == "true" : false;

    if (sourcesFile.mimetype !== "application/json")
        return errors.resError(res, errors.getError(400, "The sources file must be of type json"));

    if (!mode || !["single", "multi"].includes(mode))
        return errors.resError(res, errors.getError(400, "Please select a valid mode"));

    const project = await models.Project.findOne({ where: { id: projectId } });
    if (!project)
        return errors.resError(res, errors.getError(400, "Please specify a valid project"));

    let file = await models.File.findOne({
        where: { project: project.get("id"), name: sourcesFile.name },
    });

    const existingTargetLanguages = [];
    for (let language of await models.Language.findAll({
        attributes: ["language"],
        where: {
            project: projectId,
        },
    })) {
        existingTargetLanguages.push(language.get("language"));
    }

    const newTargetLanguages = [];

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
                    const translation = source[a];

                    if (!translation || translation == "") {
                        logger.debug("Empty translation:", key);
                        continue;
                    }

                    if (!supportedLanguages[parts[0]]) {
                        logger.debug("Unsupported language skipped:", parts[0]);
                        continue;
                    }

                    if (
                        !existingTargetLanguages.includes(parts[0]) &&
                        !newTargetLanguages.includes(parts[0])
                    )
                        newTargetLanguages.push(parts[0]);

                    keys.push({
                        key: parts[1],
                        language: parts[0],
                        translation: translation,
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
            mode: mode,
        });

    const addingTargetLanguages = [];
    for (let language of newTargetLanguages) {
        addingTargetLanguages.push({
            project: projectId,
            language: language,
        });
    }

    await models.Language.bulkCreate(addingTargetLanguages);

    logger.debug(`Inserting ${keys.length} translations (Overwrite: ${overwrite})`);

    for (let translation of keys) {
        translation.project = project.get("id");
        translation.file = file.get("id");
        translation.author = req.user.get("id");
        translation.created = sequelize.fn("NOW");
        translation.approved = req.user.get("id");
        translation.approvedOn = sequelize.fn("NOW");
    }

    let inserted = 0;
    if (overwrite) {
        await models.Translation.bulkCreate(keys);
        inserted = keys.length;
    } else {
        const uniqueKeys = [];

        const existingKeys = await models.Translation.findAll({
            where: {
                file: file.get("id"),
                project: project.get("id"),
            },
        });

        for (let key of keys) {
            let keyExists = false;
            for (let existingKey of existingKeys) {
                if (
                    existingKey.get("key") === key.key &&
                    existingKey.get("language") == key.language
                ) {
                    keyExists = true;
                    break;
                }
            }
            if (!keyExists) uniqueKeys.push(key);
        }
        await models.Translation.bulkCreate(uniqueKeys);

        inserted = uniqueKeys.length;
    }

    res.json({
        success: true,
        translations: {
            file: file.get("id"),
            indexed: keys.length,
            inserted: inserted,
            insertedTargetLanguages: newTargetLanguages.length,
        },
    });
};
