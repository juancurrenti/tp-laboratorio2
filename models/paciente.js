const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Paciente = sequelize.define('pacientes', {
    id_paciente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
    },
    telefono: {
        type: DataTypes.INTEGER,
    },
    direccion: {
        type: DataTypes.STRING,
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    embarazo: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
    },
    diagnostico: {
        type: DataTypes.STRING,
    },
    fecha_registro: { 
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Valor por defecto es la fecha y hora actual
    },
}, {
    timestamps: false, // Deshabilita las columnas createdAt y updatedAt
});

module.exports = Paciente;
