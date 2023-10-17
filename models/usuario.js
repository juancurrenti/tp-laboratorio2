const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
  },
  apellido: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  contrasena: {
    type: DataTypes.STRING,
  },
  rol: {
    type: DataTypes.STRING,
  },
});
