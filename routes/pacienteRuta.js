const express = require('express');
const router = express.Router();
const Paciente = require('../models/paciente');

router.get('/ingresar-paciente', (req, res) => {
    res.render('ingresarPaciente', { paciente: null, mensaje: null }); // Renderiza el formulario de ingreso de pacientes
});

router.post('/buscar-paciente', async (req, res) => {
    const searchType = req.body.searchType; // Obtiene el tipo de búsqueda seleccionado (DNI, apellido o email)
    const searchTerm = req.body.searchTerm; // Obtiene el valor de búsqueda ingresado

    try {
        const whereCondition = {};

        // Establece la condición de búsqueda según el tipo seleccionado
        if (searchType === 'dni') {
            whereCondition.dni = searchTerm;
        } else if (searchType === 'apellido') {
            whereCondition.apellido = searchTerm;
        } else if (searchType === 'email') {
            whereCondition.email = searchTerm;
        }

        const paciente = await Paciente.findOne({ where: whereCondition });

        // Renderiza el formulario con los campos llenos si se encuentra un paciente, o vacío si no se encuentra
        res.render('ingresarPaciente', { paciente, mensaje: paciente ? 'Paciente encontrado: ' : 'Paciente no encontrado. Ingrese los datos del paciente.' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al buscar paciente por DNI, apellido o email.');
    }
});

router.post('/guardar-paciente', async (req, res) => {
    try {
        const { dni, nombre, apellido, email, telefono, fecha_nacimiento, genero, embarazo, diagnostico } = req.body;

        const existingPaciente = await Paciente.findOne({ where: { dni } });

        if (existingPaciente) {
            await existingPaciente.update({
                nombre,
                apellido,
                email,
                telefono,
                fecha_nacimiento,
                genero,
                embarazo,
                diagnostico,
            });
            console.log('Datos del paciente actualizados con éxito:', nombre, apellido, dni);
        } else {
            // Agregar fecha_registro al crear un nuevo paciente
            await Paciente.create({
                nombre,
                apellido,
                dni,
                email,
                telefono,
                fecha_nacimiento,
                genero,
                embarazo,
                diagnostico,
                fecha_registro: new Date(), // La fecha de registro es la fecha y hora actual
            });
            console.log('Datos del paciente guardados con éxito:', nombre, apellido, dni);
        }

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar el paciente en la base de datos.');
    }
});

module.exports = router;
