const express = require('express');
const router = express.Router();
const OrdenTrabajo = require('../models/ordenes_trabajo');
const Muestra = require('../models/muestra');
const Examen = require('../models/examen');



router.post('/generacion-orden', async (req, res) => {
  try {
    // Obtiene los datos del formulario
    const { estado, examenes, tipos_muestra } = req.body;
    const id_paciente = req.body;
    
    // Verifica si id_paciente es null
    if (!id_paciente) {
      return res.status(400).send('El valor de id_paciente es nulo o no válido.');
    }

    // Crea una nueva orden de trabajo
    const nuevaOrden = await OrdenTrabajo.create({
      id_Paciente: id_paciente, // Corregir el nombre del campo
      Fecha_Creacion: new Date(),
      estado,
    });

    // Asocia los exámenes seleccionados a la orden de trabajo
    for (const examenId of examenes) {
      // Asumiendo que tienes un modelo para asociar exámenes a órdenes de trabajo
      await nuevaOrden.addExamen(examenId);
    }

    // Para cada tipo de muestra seleccionado en el formulario...
    for (const tipoMuestra of tipos_muestra) {
      await Muestra.create({
        id_Orden: nuevaOrden.id, // Corregir el nombre del campo
        id_Paciente: id_paciente, // Corregir el nombre del campo
        tipoMuestra,
        Fecha_Recepcion: new Date(),
        estadoMuestra: estado,
      });
    }

    res.redirect('/');
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    res.status(500).send('Error al procesar el formulario');
  }
});

module.exports = router;
