const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Resultado = sequelize.define(
  "Resultado",
  {
    id_Resultado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_Muestra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Muestras",
        key: "id_Muestra",
      },
    },
    id_Determinacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Determinaciones",
        key: "id_Determinacion",
      },
    },
  },
  {
    tableName: "resultados",
    timestamps: false,
  }
);

module.exports = Resultado;
