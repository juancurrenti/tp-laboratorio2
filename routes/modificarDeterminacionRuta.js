// modificarDeterminacionRuta.js
const express = require('express');
const router = express.Router();
const Examen = require('../models/examen');
const Determinacion = require('../models/determinacion');

// Ruta para mostrar el formulario de búsqueda y modificación de determinaciones
router.get('/buscar-modificar-determinacion', async (req, res) => {
  try {
    const examenes = await Examen.findAll();
    const determinaciones = await Determinacion.findAll();
    res.render('buscarModificarDeterminacion', { examenes, determinaciones });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la lista de exámenes y determinaciones.');
  }
});


// Ruta para procesar la modificación del estado de determinaciones
router.post('/modificar-determinaciones', async (req, res) => {
  try {
    const { id_Determinacion, nuevo_estado } = req.body;

    console.log('ID de determinación recibido:', id_Determinacion);


    const determinacion = await Determinacion.findByPk(id_Determinacion);

    if (!determinacion) {
      return res.status(404).send('Determinación no encontrada');
    }

    determinacion.estado = nuevo_estado;
    await determinacion.save();

    console.log('Estado de determinación modificado con éxito.');
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al modificar el estado de la determinación.');
  }
});

module.exports = router;
