const bcrypt = require("bcryptjs");
const sequelize = require("sequelize");
const errors = require("../../../errors");
const { models } = require("../../../models");

module.exports = async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    let userExists = await models.User.findOne({
        where: {
            [sequelize.Op.or]: [{ username: username }, { email: email }],
        },
    });
    if (userExists) {
        return errors.resError(res, errors.getError(409, "This username/email is already in use"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await models.User.create({
        username: username,
        email: email,
        password: hashedPassword,
        registered: sequelize.fn("NOW"),
    });

    res.status(201).json({
        success: true,
    });
};
