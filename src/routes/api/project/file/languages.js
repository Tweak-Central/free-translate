const { models } = require("../../../../models");
const supportedLanguages = require("../../../../supportedLanguages.json");

module.exports = async (req, res) => {
    const targetLanguages = await models.Language.findAll({
        attributes: ["language"],
        where: {
            project: req.project.get("id"),
        },
    });

    const sourceTranslated = await models.Translation.count({
        where: {
            project: req.project.get("id"),
            file: req.file.get("id"),
            language: req.project.get("sourceLanguage"),
        },
    });

    const languages = [];

    for (let targetLanguage of targetLanguages) {
        let language = targetLanguage.get("language");
        let languageTranslated = await models.Translation.count({
            where: {
                project: req.project.get("id"),
                file: req.file.get("id"),
                language,
            },
        });

        languages.push({
            langauge: { code: language, ...supportedLanguages[language] },
            progress: {
                translated: languageTranslated,
                percentage: Math.floor((languageTranslated / sourceTranslated) * 100),
            },
        });
    }

    res.json({
        success: true,
        languages: {
            totalKeys: sourceTranslated,
            targets: languages,
        },
    });
};
