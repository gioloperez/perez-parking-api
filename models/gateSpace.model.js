const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class GateSpace extends Model {}

GateSpace.init({
    distance: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize,
    modelName: "gateSpace",
    timestamps: false
});

module.exports = GateSpace;