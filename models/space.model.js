const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Gate = require('./gate.model');
const GateSpace = require('./gateSpace.model');

class Space extends Model {}

Space.init({
    spaceId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isOccupied: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    description: {
        type: DataTypes.STRING
    },
}, {
    sequelize,
    modelName: "space",
    timestamps: false
});

Space.belongsToMany(Gate, { through: GateSpace, foreignKey: "spaceId"});
Gate.belongsToMany(Space, { through: GateSpace, foreignKey: "gateId"});
Space.hasMany(GateSpace, { foreignKey: "spaceId" });
GateSpace.belongsTo(Space, { foreignKey: "spaceId" });
Gate.hasMany(GateSpace, { foreignKey: "gateId" });
GateSpace.belongsTo(Gate, { foreignKey: "gateId" });

module.exports = Space;