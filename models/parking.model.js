const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Space = require('./space.model');

class Parking extends Model {}

Parking.init({
    parkingId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    plateNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicleSize: {
        type: DataTypes.INTEGER
    },
    startTime: {
        type: DataTypes.TIME
    },
    endTime: {
        type: DataTypes.TIME
    },
    isContinuous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    exitRate: {
        type: DataTypes.FLOAT
    }
}, {
    sequelize,
    modelName: "parking",
    timestamps: false
});

Space.hasMany(Parking, { foreignKey: "spaceId" });
Parking.belongsTo(Space, { foreignKey: "spaceId" });

module.exports = Parking;