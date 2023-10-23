const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ValoresReferencia = sequelize.define('valoresReferencia', {
  id_valor_ref: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  edad_minima: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  edad_maxima: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sexo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valor_minimo: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  valor_maximo: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unidad_medida: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = ValoresReferencia;
