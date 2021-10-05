const { DataTypes, Sequelize } = require("sequelize");

/**
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
    return sequelize.define(
        "File",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            project: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
        },
        { timestamps: false }
    );
};
