const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Examen = sequelize.define('examenes', {
  id_examen: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  codigo: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: false,
});

module.exports = Examen;
