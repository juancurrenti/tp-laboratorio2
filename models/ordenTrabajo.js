const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenTrabajo = sequelize.define('OrdenTrabajo', {
  fechaCreacion: {
    type: DataTypes.DATE,
  },
  estado: {
    type: DataTypes.STRING,
  },
});
