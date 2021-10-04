const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE, {
    dialect: "mysql",
});

const models = [require("./user.js")];

for (let model of models) {
    model(sequelize);
}

module.exports = sequelize;
