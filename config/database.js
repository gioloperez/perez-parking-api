const Sequelize = require('sequelize');
const constants = require('./constants');
const sequelize = new Sequelize('perez-parking-db', 'admin','password', {
    dialect: 'sqlite',
    host: './perez-parking-dev-db.sqlite',
    logging: constants.dbLogging
});

module.exports = sequelize;