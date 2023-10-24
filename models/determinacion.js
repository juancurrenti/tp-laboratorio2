const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Determinaciones = sequelize.define('Determinaciones', {
  ID_Determinacion: {
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
  Valor: {
    type: DataTypes.DECIMAL(10, 2)
  },
  Unidad_Medida: {
    type: DataTypes.STRING
  },
  Sexo: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'Determinaciones',
  timestamps: false
});

module.exports = Determinaciones;