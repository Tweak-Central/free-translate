const { DataTypes, Sequelize } = require("sequelize");

/**
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
    return sequelize.define(
        "Language",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            project: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            language: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
        },
        { timestamps: false }
    );
};
