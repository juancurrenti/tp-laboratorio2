const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExamenValoresReferencia = sequelize.define('examen_valores_referencia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = ExamenValoresReferencia;
