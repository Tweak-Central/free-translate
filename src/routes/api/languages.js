const supportedLanguages = require("../../supportedLanguages.json");

module.exports = (req, res) => {
    res.json({
        success: true,
        languages: supportedLanguages,
    });
};
