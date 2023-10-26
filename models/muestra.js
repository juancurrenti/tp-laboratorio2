const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Muestra = sequelize.define('Muestras', {
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
    allowNull: false,

  },
  Fecha_Recepcion: {
    type: DataTypes.DATE,
    allowNull: false,

  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,

  tableName: 'muestras',

});
module.exports = Muestra;