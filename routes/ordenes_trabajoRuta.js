const express = require('express');
const router = express.Router();
const OrdenTrabajo = require('../models/ordenes_trabajo'); 
const Muestra = require('../models/muestra'); 

// Esta ruta maneja el envío del formulario y crea la orden de trabajo y muestras en la base de datos
router.post('/generar-orden', async (req, res) => {
  try {
    // Obtiene los datos del formulario
    const { paciente, estado, examenes, tipos_muestra } = req.body;

    // Crea una nueva orden de trabajo
    const nuevaOrden = await OrdenTrabajo.create({
      paciente,
      estado,
    });

    // Para cada tipo de muestra seleccionado en el formulario
    for (const tipoMuestra of tipos_muestra) {
      await Muestra.create({
        idOrdenTrabajo: nuevaOrden.id, 
        tipoMuestra,
        estadoMuestra: estado, 
      });
    }

    res.redirect('/ordenImprimir');
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    res.status(500).send('Error al procesar el formulario');
  }
});

module.exports = router;
