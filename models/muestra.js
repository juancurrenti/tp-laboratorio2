const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Muestra = sequelize.define('Muestra', {
  tipoMuestra: {
    type: DataTypes.STRING,
  },
  fechaRecoleccion: {
    type: DataTypes.DATE,
  },
  estado: {
    type: DataTypes.STRING,
  },
});
