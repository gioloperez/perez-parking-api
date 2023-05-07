const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Gate extends Model {}

Gate.init({
    gateId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: "gate",
    timestamps: false
});


module.exports = Gate;