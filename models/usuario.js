const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Usuarios = sequelize.define('Usuarios', {
  ID_Usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre_Usuario: {
    type: DataTypes.STRING
  },
  Rol: {
    type: DataTypes.STRING
  },
  Correo_Electronico: {
    type: DataTypes.STRING
  },
  Password: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'Usuarios',
  timestamps: false
});

module.exports = Usuarios;