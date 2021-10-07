const { models } = require("../../../models");
const supportedLanguages = require("../../../supportedLanguages.json");

module.exports = async (req, res) => {
    const user = req.user;

    const permissions = await models.Permission.findAll({
        where: {
            user: user.get("id"),
        },
    });

    const projects = await models.Project.findAll();

    const displayedProjects = [];

    for (let project of projects) {
        project = project.get();
        project.sourceLanguage = {
            key: project.sourceLanguage,
            ...supportedLanguages[project.sourceLanguage],
        };
        let projectAvailable = false;
        if (project.private) {
            for (let permission of permissions) {
                if (permission.get("project") == project.id) {
                    if (permission.get("accessLevel") > 0) projectAvailable = true;
                    break;
                }
            }
        } else {
            projectAvailable = true;
        }
        if (!projectAvailable) continue;

        const totalTranslations = await models.Translation.findAll({
            attributes: ["created"],
            where: {
                project: project.id,
                language: project.sourceLanguage.key,
            },
        });

        project.totalKeys = totalTranslations.length;
        project.lastActivity = project.createdOn;
        if (totalTranslations.length > 0)
            project.lastActivity = totalTranslations[0].get("created");

        displayedProjects.push(project);
    }

    res.json({
        success: true,
        projects: displayedProjects,
    });
};
