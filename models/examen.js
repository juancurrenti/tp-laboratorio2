const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Examenes = sequelize.define('Examenes', {
  ID_Examen: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'Examenes',
  timestamps: false
});

module.exports = Examenes;