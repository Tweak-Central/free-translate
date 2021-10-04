const { DataTypes, Sequelize } = require("sequelize");

/**
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
    sequelize.define(
        "BlockedUser",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            blockedUser: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            project: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            blockedBy: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            reason: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            blockedOn: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        { timestamps: false }
    );
};
