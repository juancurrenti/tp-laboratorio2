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
        const tiposMuestra = [
            { value: "sangre", label: "Sangre" },
            { value: "orina", label: "Orina" },
            { value: "heces", label: "Heces" },
            { value: "liquidoCefaloraquideo", label: "Líquido Cefalorraquídeo" },
            { value: "saliva", label: "Saliva" },
            { value: "nasofaringea", label: "Secreción Nasofaríngea" }
        ];

        // Obtén la lista de exámenes y pacientes desde la base de datos
        const examenes = await Examen.findAll();
        const idsExamen=[];
        for (const examen of examenes) {
          idsExamen.push(examen.id_examen);
        }
        console.log("Ids de los examenes: ", idsExamen)
        const pacientes = await Paciente.findAll();
        res.render('generarOrden', { tiposMuestra, examenes, pacientes });
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

        console.log('Examenes en el servidor',examenesSelectedIds);
        const examenesSelectedIdsArray = examenesSelectedIds.split(',').map(id_examen => parseInt(id_examen));
        console.log('Examenes en el servidor pero en un array',examenesSelectedIdsArray);

        // Crea una nueva orden de trabajo
        const nuevaOrden = await OrdenTrabajo.create({
            id_Paciente: id_paciente,
            estado,
            Fecha_Creacion: new Date(),
        }, {
            returning: true,
        });
        const nuevaOrdenId = nuevaOrden.id_Orden;

        for (const tipoMuestra of tipos_muestra) {
          const estadoValue = req.body[`estado_${tipoMuestra}`];
          await Muestra.create({
            id_Orden: nuevaOrdenId,
            id_Paciente: id_paciente,
            Fecha_Recepcion: new Date(),
            Tipo_Muestra: tipoMuestra,
            estado: estadoValue,
          });
        }
    // Itera sobre los IDs de los exámenes seleccionados y crea las relaciones
    for (const examenId of examenes) {
      await OrdenesExamenes.create({
        id_Orden: nuevaOrdenId,
        id_Examen: examenId,
      });
    }
    // Para cada tipo de muestra seleccionado en el formulario...
        res.redirect('/');
    } catch (error) {
        console.error('Error al procesar el formulario:', error);
        res.status(500).send('Error al procesar el formulario');
    }

  });

module.exports = router;
