const express = require('express');
const router = express.Router();
const Paciente = require('../models/paciente');

router.get('/ingresar-paciente', (req, res) => {
    res.render('ingresarPaciente', { paciente: null, mensaje: null }); // Renderiza el formulario de ingreso de pacientes
});

router.post('/buscar-paciente', async (req, res) => {
    const dni = req.body.dni; // Obtiene el DNI ingresado en el formulario

    try {
        const paciente = await Paciente.findOne({ where: { dni } });

        if (paciente) {
            // Paciente encontrado, muestra el formulario con los campos llenos
            res.render('ingresarPaciente', { paciente, mensaje1: 'Paciente encontrado: ' });
        } else {
            // Paciente no encontrado, muestra el mensaje y redirige a la página de ingreso de paciente
            res.render('ingresarPaciente', { paciente: null, mensaje: 'Paciente no encontrado. Ingrese los datos del paciente.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al buscar paciente por DNI.');
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
