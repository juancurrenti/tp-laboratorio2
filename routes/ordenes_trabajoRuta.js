const express = require('express');
const router = express.Router();
const OrdenTrabajo = require('../models/ordenes_trabajo'); 
const Muestra = require('../models/muestra'); 

<<<<<<< HEAD

router.get(`/generar-orden`, async (req, res) => {
  try {
    // Obtén la lista de exámenes desde la base de datos
    const tiposMuestra = [
      { value: "sangre", label: "Sangre" },
      { value: "orina", label: "Orina" },
      { value: "heces", label: "Heces" },
      { value: "liquidoCefaloraquideo", label: "Líquido Cefalorraquídeo" },
      { value: "saliva", label: "Saliva" },
      { value: "nasofaringea", label: "Secreción Nasofaríngea" }
    ];
    const { id_paciente, nombre, apellido, dni } = req.params;

    // Obtén el valor de id_paciente desde los parámetros de la URL

    // Obtén la lista de exámenes desde la base de datos
    const examenes = await Examen.findAll();
    res.render('generarorden', { tiposMuestra, id_paciente, nombre, apellido, dni, examenes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la lista de exámenes.');
  }
});

// Esta ruta maneja el envío del formulario y crea la orden de trabajo y muestras en la base de datos
router.post('/generar-orden/:id_paciente', async (req, res) => {

    const { id_paciente, nombre, apellido, dni } = req.params;

    try {
      // Obtén la lista de exámenes desde la base de datos
      const examenes = await Examen.findAll();
      res.render('generarOrden', { tiposMuestra, id_paciente, nombre, apellido, dni, examenes });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener la lista de exámenes.');
    }

  try {
    // Obtiene los datos del formulario
    const { paciente, estado, examenes, tipos_muestra } = req.body;
    const id_paciente = req.params.id_paciente; // Captura id_paciente desde la URL

    // Verifica si id_paciente es null
    if (!id_paciente) {
      return res.status(400).send('El valor de id_paciente es nulo o no válido.');
    }

    // Crea una nueva orden de trabajo
    const nuevaOrden = await OrdenTrabajo.create({
      id_paciente: id_paciente,
      Fecha_Creacion: new Date(), // Asigna id_paciente en la creación de la orden
=======
// Esta ruta maneja el envío del formulario y crea la orden de trabajo y muestras en la base de datos
router.post('/generacion-orden', async (req, res) => {
  try {
    // Obtiene los datos del formulario
    const { paciente, estado, examenes, tipos_muestra } = req.body;

    // Crea una nueva orden de trabajo
    const nuevaOrden = await OrdenTrabajo.create({
>>>>>>> parent of 30ec2f3 (1)
      paciente,
      estado,
    });

    // Para cada tipo de muestra seleccionado en el formulario
    for (const tipoMuestra of tipos_muestra) {
      await Muestra.create({
<<<<<<< HEAD
        id_orden: nuevaOrden.id,
        id_paciente,
        tipoMuestra,
        Fecha_Recepcion:new Date(),
        estadoMuestra: estado,
=======
        idOrdenTrabajo: nuevaOrden.id, 
        tipoMuestra,
        estadoMuestra: estado, 
>>>>>>> parent of 30ec2f3 (1)
      });
    }

    res.redirect('/ordenImprimir');
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    res.status(500).send('Error al procesar el formulario');
  }
});

module.exports = router;
