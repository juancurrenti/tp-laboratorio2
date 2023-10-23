const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resultado = sequelize.define('Resultado', {
  valor: {
    type: DataTypes.DECIMAL(10, 2),
  },
  unidadMedida: {
    type: DataTypes.STRING,
  },
  fechaRegistro: {
    type: DataTypes.DATE,
  },
});
