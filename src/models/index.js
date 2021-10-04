const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE, {
    dialect: "mysql",
});

const modelDefiners = [
    require("./user"),
    require("./project"),
    require("./translation"),
    require("./blockedUser"),
    require("./permission"),
];

for (let model of modelDefiners) {
    model(sequelize);
}

// Relations
const models = sequelize.models;

module.exports = sequelize;
