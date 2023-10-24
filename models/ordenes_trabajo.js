const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenesTrabajo = sequelize.define('OrdenesTrabajo', {
  ID_Orden: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ID_Paciente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Fecha_Creacion: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'ordenes_trabajo',
  timestamps: false
});

module.exports = OrdenesTrabajo;