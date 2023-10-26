const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Muestra = require('../models/muestra')
const OrdenesTrabajo = sequelize.define('OrdenesTrabajo', {
  id_Orden: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_Paciente: {
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
OrdenesTrabajo.hasMany(Muestra, { foreignKey: 'id_Orden' }); // Define la relación
module.exports = OrdenesTrabajo;