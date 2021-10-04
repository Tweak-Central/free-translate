const { models } = require("../../../models");

module.exports = function (req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    models.User.findAll({
        where: {
            username: username,
        },
    });
};
