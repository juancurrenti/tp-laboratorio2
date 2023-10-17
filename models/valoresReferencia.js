const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ValoresReferencia = sequelize.define('ValoresReferencia', {
  edadMinima: {
    type: DataTypes.INTEGER,
  },
  edadMaxima: {
    type: DataTypes.INTEGER,
  },
  sexo: {
    type: DataTypes.STRING,
  },
  valorMinimo: {
    type: DataTypes.DECIMAL(10, 2),
  },
  valorMaximo: {
    type: DataTypes.DECIMAL(10, 2),
  },
});
