const express = require('express');
const router = express.Router();
const Paciente = require('../models/paciente');

router.get('/ingresar-paciente', (req, res) => {
    res.render('ingresarPaciente', { paciente: null, mensaje: null }); // Renderiza el formulario de ingreso de pacientes
});

router.post('/buscar-paciente', async (req, res) => {
    const searchType = req.body.searchType;
    const searchTerm = req.body.searchTerm;

    try {
        const whereCondition = {};

        if (searchType === 'dni') {
            whereCondition.dni = searchTerm;
        } else if (searchType === 'apellido') {
            // Cambio: Buscar todos los pacientes con el mismo apellido
            const pacientes = await Paciente.findAll({ where: { apellido: searchTerm } });

            if (pacientes.length > 1) {
                // Si hay múltiples pacientes con el mismo apellido, mostrar una lista para seleccionar
                res.render('seleccionarPaciente', { pacientes, searchTerm, searchType });
            } else if (pacientes.length === 1) {
                // Si se encuentra un paciente, renderizar el formulario con los campos llenos
                res.render('ingresarPaciente', { paciente: pacientes[0], mensaje: 'Paciente encontrado:' });
            } else {
                // Si no se encuentra un paciente, mostrar un mensaje de error
                res.render('ingresarPaciente', { paciente: null, mensaje: 'Paciente no encontrado. Ingrese los datos del paciente.' });
            }
            return; // Importante: sal del controlador después de renderizar la lista de pacientes
        } else if (searchType === 'email') {
            whereCondition.email = searchTerm;
        }

        const paciente = await Paciente.findOne({ where: whereCondition });

        if (paciente) {
            // Si se encuentra un paciente, renderizar el formulario con los campos llenos
            res.render('ingresarPaciente', { paciente, mensaje: 'Paciente encontrado:' });
        } else {
            // Si no se encuentra un paciente, mostrar un mensaje de error
            res.render('ingresarPaciente', { paciente: null, mensaje: 'Paciente no encontrado. Ingrese los datos del paciente.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al buscar paciente por DNI, apellido o email.');
    }
});

// Controlador para seleccionar un paciente de la lista
router.get('/editar-paciente/:id', async (req, res) => {
    const { id } = req.params;
    const { searchTerm, searchType } = req.query;

    try {
        const paciente = await Paciente.findByPk(id);

        if (paciente) {
            // Renderiza el formulario con los campos llenos y muestra el mensaje
            res.render('ingresarPaciente', { paciente, mensaje: 'Paciente seleccionado:' });
        } else {
            // Si no se encuentra un paciente, muestra un mensaje de error
            res.render('ingresarPaciente', { paciente: null, mensaje: 'Paciente no encontrado. Ingrese los datos del paciente.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al seleccionar paciente para edición.');
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
