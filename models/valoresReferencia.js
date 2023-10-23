const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ValoresReferencia = sequelize.define('ValoresReferencia', {
    ID_ValorReferencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_Examen: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Nombre_Determinacion: {
      type: DataTypes.STRING
    },
    Valor_Referencia_Minimo: {
      type: DataTypes.DECIMAL(10, 2)
    },
    Valor_Referencia_Maximo: {
      type: DataTypes.DECIMAL(10, 2)
    },
    Sexo: {
      type: DataTypes.STRING
    },
    Edad_Minima: {
      type: DataTypes.INTEGER
    },
    Edad_Maxima: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'ValoresReferencia',
    timestamps: false
  });
  
  module.exports = ValoresReferencia;