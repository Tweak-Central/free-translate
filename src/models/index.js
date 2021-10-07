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
    require("./language"),
];

for (let model of modelDefiners) {
    model(sequelize);
}

// Relations
const models = sequelize.models;

models.Permission.belongsTo(models.User, {
    foreignKey: "user",
    onDelete: "CASCADE",
});
models.Permission.belongsTo(models.Project, {
    foreignKey: "project",
    onDelete: "CASCADE",
});

models.Translation.belongsTo(models.Project, {
    foreignKey: "project",
    onDelete: "CASCADE",
});
models.Translation.belongsTo(models.User, { foreignKey: "author", onDelete: "CASCADE" });
models.Translation.belongsTo(models.User, { foreignKey: "approved", onDelete: "CASCADE" });
models.Translation.belongsTo(models.File, { foreignKey: "file", onDelete: "CASCADE" });

models.BlockedUser.belongsTo(models.User, { foreignKey: "blockedUser", onDelete: "CASCADE" });
models.BlockedUser.belongsTo(models.User, { foreignKey: "blockedBy", onDelete: "CASCADE" });
models.BlockedUser.belongsTo(models.Project, { foreignKey: "project", onDelete: "CASCADE" });

models.File.belongsTo(models.Project, { foreignKey: "project", onDelete: "CASCADE" });

models.Language.belongsTo(models.Project, { foreignKey: "project", onDelete: "CASCADE" });

// EXPORT

module.exports = sequelize;
