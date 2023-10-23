const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Determinacion = sequelize.define('Determinacion', {
  nombreDeterminacion: {
    type: DataTypes.STRING,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
  },
  unidadMedida: {
    type: DataTypes.STRING,
  },
});
