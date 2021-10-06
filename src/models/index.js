const { Sequelize } = require("sequelize");
const logger = require("log4js").getLogger("database");

const sequelize = new Sequelize(process.env.DATABASE, {
    dialect: "mysql",
    logging: (msg) => logger.info(msg),
});

const modelDefiners = [
    require("./user"),
    require("./project"),
    require("./translation"),
    require("./file"),
    require("./blockedUser"),
    require("./permission"),
];

for (let model of modelDefiners) {
    model(sequelize);
}

// Relations
const models = sequelize.models;

models.Permission.belongsTo(models.User, {
    foreignKey: "user",
});
models.Permission.belongsTo(models.Project, {
    foreignKey: "project",
});

models.Translation.belongsTo(models.Project, {
    foreignKey: "project",
});
models.Translation.belongsTo(models.User, { foreignKey: "author", onDelete: "cascade" });
models.Translation.belongsTo(models.User, { foreignKey: "approved", onDelete: "cascade" });
models.Translation.belongsTo(models.File, { foreignKey: "file", onDelete: "cascade" });

models.BlockedUser.belongsTo(models.User, { foreignKey: "blockedUser", onDelete: "cascade" });
models.BlockedUser.belongsTo(models.User, { foreignKey: "blockedBy", onDelete: "cascade" });
models.BlockedUser.belongsTo(models.Project, { foreignKey: "project", onDelete: "cascade" });

models.File.belongsTo(models.Project, { foreignKey: "project" });

// EXPORT

module.exports = sequelize;
