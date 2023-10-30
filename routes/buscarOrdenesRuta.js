const express = require('express');
const router = express.Router();
const OrdenTrabajo = require('../models/ordenes_trabajo');

// Ruta para buscar un paciente y mostrar sus órdenes de trabajo
router.get('/ordenes', (req, res) => {
  
  res.render('buscarPacientesOrdenes'); // Renderiza la vista inicial para buscar paciente y órdenes
});

// Ruta para manejar la búsqueda de órdenes de trabajo por id_paciente
router.post('/ordenes', async (req, res) => {
  const idPaciente = req.body.idPaciente;
  console.log(idPaciente);
  
  // Buscar órdenes de trabajo por id_paciente
  const ordenesTrabajo = await OrdenTrabajo.findAll({
    where: { id_paciente: idPaciente }
  });

  if (ordenesTrabajo.length === 0) {
    // No se encontraron órdenes de trabajo para el paciente
    res.json([]); // Enviar una respuesta JSON vacía
  } else {
    // Se encontraron órdenes de trabajo para el paciente
    res.json(ordenesTrabajo); // Enviar las órdenes de trabajo en formato JSON
  }
});
module.exports = router;
