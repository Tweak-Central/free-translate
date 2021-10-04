const { DataTypes, Sequelize } = require("sequelize");

/*
Access levels:
 - 0: none
 - 1: read
 - 2: read/write
 - 3: approve
 - 4: manage
 - 5: admin
 - 6: owner
*/

/**
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
    return sequelize.define(
        "Permission",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            user: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            project: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            accessLevel: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            assigned: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        { timestamps: false }
    );
};
