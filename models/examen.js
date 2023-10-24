const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Examenes = sequelize.define('examen', {
  ID_Examen: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_examen: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion:{
    type: DataTypes.STRING,
    allowNull: false,

  },
  codigo:{
    type: DataTypes.STRING,
    allowNull: false,

  }
}, {
  tableName: 'examen',
  timestamps: false
});

module.exports = Examenes;