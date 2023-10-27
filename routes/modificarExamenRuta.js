const express = require('express');
const router = express.Router();
const Examen = require('../models/examen');

// Ruta para buscar y modificar exámenes
router.get('/buscar-modificar-examen', async (req, res) => {
  try {
    // Obtener todos los exámenes
    const examenes = await Examen.findAll();

    res.render('buscarModificarExamen', { examenes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los exámenes.');
  }
});

// Ruta para procesar la búsqueda y mostrar el formulario de modificación
router.post('/buscar-modificar-examen', async (req, res) => {
  try {
    const { id_examen } = req.body;

    // Obtener el examen por ID
    const examen = await Examen.findByPk(id_examen);

    if (!examen) {
      return res.status(404).send('Examen no encontrado');
    }

    res.render('buscarModificarExamen', { examen });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al buscar y modificar el examen.');
  }
});

// Ruta para procesar la modificación del examen
router.post('/modificar', async (req, res) => {
  try {
    const { id_examen, nombre_examen, descripcion, codigo, estado } = req.body;

    // Obtén el examen por ID
    const examen = await Examen.findByPk(id_examen);

    if (!examen) {
      return res.status(404).send('Examen no encontrado');
    }

    // Asignar el estado según el valor del menú desplegable
    examen.estado = parseInt(estado, 10);

    // Actualizar el examen en la base de datos
    await examen.save();

    // Resto del código...

    console.log('Examen modificado con éxito.');
    res.redirect('/modificar-examen/buscar-modificar-examen');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al modificar el examen.');
  }
});

module.exports = router;