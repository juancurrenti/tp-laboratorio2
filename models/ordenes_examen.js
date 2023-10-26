const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenesExamenes = sequelize.define('ordenes_examenes', {
  id_Orden_Examen: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_Orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_examen: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'ordenes_examenes',
});

module.exports = OrdenesExamenes;
