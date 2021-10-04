const sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errors = require("../../../errors");
const { models } = require("../../../models");
const jwtSecret = process.env.JWT_SECRET || "freelate001$$";

module.exports = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await models.User.findOne({
        where: {
            email: email,
        },
    });

    if (!user) return errors.resError(res, errors.getError(401, "This user does not exist"));

    if (!password || !(await bcrypt.compare(password, user.get("password"))))
        return errors.resError(res, errors.getError(401, "Incorrect password"));

    const loginToken = jwt.sign(
        {
            username: user.get("username"),
            userId: user.get("id"),
        },
        jwtSecret,
        {
            expiresIn: "7d",
        }
    );

    await user.update("lastLogin", sequelize.fn("NOW"));

    res.status(200).json({
        success: true,
        token: loginToken,
        user: {
            username: user.get("username"),
        },
    });
};
