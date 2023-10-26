const express = require('express');
const router = express.Router();
const OrdenTrabajo = require('../models/ordenes_trabajo');
const Muestra = require('../models/muestra');
const Examen = require('../models/examen');
const Paciente = require('../models/paciente');
const OrdenesExamenes = require('../models/ordenes_examen');

// Ruta para mostrar la vista de generación de orden
router.get('/generacion-orden', async (req, res) => {
    try {
        // Obtén la lista de exámenes y pacientes desde la base de datos
        const examenes = await Examen.findAll();
        const pacientes = await Paciente.findAll();

        // Renderiza la vista de generación de orden con los datos necesarios
        res.render('generarOrden', { examenes, pacientes });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la lista de exámenes.');
    }
});

// Ruta para procesar la generación de orden
router.post('/generacion-orden', async (req, res) => {
    try {
        // Obtiene los datos del formulario
        const { estado, tipos_muestra, id_paciente, examenesSelectedIds } = req.body;

        // Verifica si id_paciente es null
        if (!id_paciente) {
            return res.status(400).send('El valor de id_paciente es nulo o no válido.');
        }

        // Convierte examenesSelectedIds en un arreglo de IDs
        const examenesSeleccionados = examenesSelectedIds.split(',').map(id => parseInt(id));

        // Crea una nueva orden de trabajo
        const nuevaOrden = await OrdenTrabajo.create({
            id_Paciente: id_paciente,
            estado,
            Fecha_Creacion: new Date(),
        }, {
            returning: true,
        });

        const nuevaOrdenId = nuevaOrden.id_Orden;
        console.log('Valor de examenesSelectedIds:', examenesSeleccionados);

        // Itera sobre los IDs de los exámenes seleccionados y crea las relaciones en la tabla OrdenesExamenes
        for (const examenId of examenesSeleccionados) {
          console.log("EXAMEN ID:",examenId)
            await OrdenesExamenes.create({
                id_Orden: nuevaOrdenId,
                id_Examen: examenId,
            });
        }

        // Para cada tipo de muestra seleccionado en el formulario...
        for (const tipoMuestra of tipos_muestra) {
            const estadoValue = req.body[`estado_${tipoMuestra}${tipoMuestra}`];
            await Muestra.create({
                id_Orden: nuevaOrdenId,
                id_Paciente: id_paciente,
                Fecha_Recepcion: new Date(),
                Tipo_Muestra: tipoMuestra,
                estado: estadoValue,
            });
        }

        res.redirect('/'); // Redirige a la página principal o a donde desees después de procesar el formulario.
    } catch (error) {
        console.error('Error al procesar el formulario:', error);
        res.status(500).send('Error al procesar el formulario');
    }
});

module.exports = router;
