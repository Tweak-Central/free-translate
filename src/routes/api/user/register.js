const bcrypt = require("bcryptjs");
const sequelize = require("sequelize");
const gravatar = require("gravatar");
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
    const profilePicture = gravatar.url(email, { size: 100 }, true);

    const newUser = await models.User.create({
        username: username,
        email: email,
        password: hashedPassword,
        picture: profilePicture,
    });

    res.status(201).json({
        success: true,
        user: {
            username: newUser.get("username"),
            email: newUser.get("email"),
            picture: newUser.get("picture"),
        },
    });
};
