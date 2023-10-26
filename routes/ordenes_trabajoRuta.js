// OrdenesTrabajoRuta.js
const express = require('express');
const router = express.Router();
const OrdenTrabajo = require('../models/ordenes_trabajo');
const Muestra = require('../models/muestra');
const Examen = require('../models/examen');
const Paciente = require('../models/paciente');
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
    const { estado,  tipos_muestra, id_paciente } = req.body;
    const examenes = await Examen.findAll();
    console.log(examenes); // Agrega esta línea para depurar
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

    for (const tipoMuestra of tipos_muestra) {
      await Muestra.create({
        id_Orden: nuevaOrden.id, // Corregir el nombre del campo
        id_Paciente: id_paciente, // Corregir el nombre del campo
        tipoMuestra,
        Fecha_Recepcion: new Date(),
        estadoMuestra: estado,
      });
    }
    // Asocia los exámenes seleccionados a la orden de trabajo
    for (const examenId of examenes) {
      // Asumiendo que tienes un modelo para asociar exámenes a órdenes de trabajo
      await nuevaOrden.addExamen(examenId);
    }

    // Para cada tipo de muestra seleccionado en el formulario...

    res.redirect('/');
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    res.status(500).send('Error al procesar el formulario');
  }
});

module.exports = router;
