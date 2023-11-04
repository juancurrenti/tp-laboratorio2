const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Muestra = sequelize.define('Muestra', {
  id_Muestra:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_Orden:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      model: 'ordenes_trabajo',
      key: 'id_Orden',
    }
  },
  id_Paciente:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Tipo_Muestra: {
    type: DataTypes.STRING,
  },
  Fecha_Recepcion: {
    type: DataTypes.DATE,
  },
  estado: {
    type: DataTypes.STRING,
  },
},{
  timestamps: false,
});
module.exports = Muestra;