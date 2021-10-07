const { models } = require("../../../../models");

module.exports = async (req, res) => {
    const project = req.project;

    const files = await models.File.findAll({
        attributes: ["id", "name", "mode"],
        where: {
            project: project.get("id"),
        },
    });

    const targetLanguages = await models.Language.count({
        where: {
            project: project.get("id"),
        },
    });

    const translations = await models.Translation.findAll({
        where: {
            project: project.get("id"),
        },
    });

    const indexedFiles = {};

    for (let translation of translations) {
        if (!indexedFiles[translation.get("file")]) {
            for (let file of files) {
                if (file.get("id") == translation.get("file")) {
                    indexedFiles[translation.get("file")] = file.get();
                    break;
                }
            }
        }
        let file = indexedFiles[translation.get("file")];
        if (!file.progress)
            file.progress = { sourceKeys: 0, totalKeys: 0, translatedKeys: 0, percentage: 0 };

        if (translation.get("language") == project.get("sourceLanguage"))
            file.progress.sourceKeys++;

        if (translation.get("language") != project.get("sourceLanguage"))
            file.progress.translatedKeys++;

        file.lastActivity = {
            on: translation.get("created"),
            id: translation.get("id"),
            by: translation.get("author"),
        };
    }

    const tf = [];
    for (let file in indexedFiles) {
        file = indexedFiles[file];
        file.progress.totalKeys = targetLanguages * file.progress.sourceKeys;

        file.progress.percentage = Math.floor(
            (file.progress.translatedKeys / file.progress.totalKeys) * 100
        );
        tf.push(file);
    }

    res.json({
        success: true,
        files: tf,
    });
};
