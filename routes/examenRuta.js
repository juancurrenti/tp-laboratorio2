const express = require('express');
const router = express.Router();
const Examen = require('../models/examen');
const ValoresReferencia = require('../models/valoresReferencia');

// Ruta para mostrar el formulario de creación de exámenes con valores de referencia
router.get('/crear-examen', async (req, res) => {
  try {
    const valoresReferencia = await ValoresReferencia.findAll();
    res.render('crearExamen', { valoresReferencia });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los valores de referencia.');
  }
});

// Ruta para procesar el formulario de creación de exámenes con valores de referencia
router.post('/crear-examen', async (req, res) => {
  try {
    const { nombre, descripcion, codigo, valoresReferencia } = req.body;

    // Crea el examen
    const examen = await Examen.create({
      nombre,
      descripcion,
      codigo,
    });


    console.log('Examen creado con éxito:', examen);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el examen con valores de referencia.');
  }
});

// Ruta para mostrar el formulario de creación de valores de referencia
router.get('/crear-valores', async (req, res) => {
  try {
    const examenes = await Examen.findAll();
    res.render('crearValores', { examenes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la lista de exámenes.');
  }
});

// Ruta para procesar la creación de valores de referencia
router.post('/crear-valores', async (req, res) => {
  try {
    const { edad_minima, edad_maxima, sexo, valor_minimo, valor_maximo, unidad_medida} = req.body;
    // Crea los valores de referencia incluyendo id_examen
    await ValoresReferencia.create({
      edad_minima,
      edad_maxima,
      sexo,
      valor_minimo,
      valor_maximo,
      unidad_medida,
    });

    console.log('Valores de referencia creados con éxito.');
    res.redirect('/examen/crear-valores'); // Redirige a la página de creación de valores de referencia
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear los valores de referencia.');
  }
});
module.exports = router;
