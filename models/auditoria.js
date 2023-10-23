const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Auditoria = sequelize.define('Auditoria', {
  operacion: {
    type: DataTypes.STRING,
  },
  fechaHora: {
    type: DataTypes.DATE,
  },
});
