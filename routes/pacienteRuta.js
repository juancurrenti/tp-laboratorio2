const express = require('express');
const router = express.Router();
const paciente = require('../models/paciente'); // Importa el modelo de paciente

router.post('/guardar-paciente', async (req, res) => {
    try {
        const { nombre, apellido, dni, email, telefono, direccion, fecha_nacimiento, genero, embarazo,diagnostico } = req.body;

        await paciente.create({
            nombre,
            apellido,
            dni,
            email,
            telefono,
            direccion,
            fecha_nacimiento,
            genero,
            embarazo,
            diagnostico,
        });

        res.send('Paciente guardado con éxito.');
        console.log(paciente.id_paciente)
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar el paciente en la base de datos.');
    }
});

module.exports = router;
