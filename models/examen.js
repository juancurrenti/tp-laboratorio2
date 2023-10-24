const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Examenes = sequelize.define('examen', {
  ID_Examen: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_examen: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'examen',
  timestamps: false
});

module.exports = Examenes;