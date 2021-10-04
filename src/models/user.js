const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                unique: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            registered: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            lastLogin: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            timestamps: false,
        }
    );
};
