const express = require('express');
const router = express.Router();
const OrdenTrabajo = require('../models/ordenes_trabajo'); 
const Muestra = require('../models/muestra'); 
const Examen = require('../models/examen');

// Esta ruta maneja el envío del formulario y crea la orden de trabajo y muestras en la base de datos
router.get('/generar-orden/:id_paciente/:nombre/:apellido/:dni', async (req, res) => {
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

    // Obtén la lista de exámenes desde la base de datos
    const examenes = await Examen.findAll();
    res.render('generarOrden', { tiposMuestra, id_paciente, nombre, apellido, dni, examenes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la lista de exámenes.');
  }
});

router.post('/generacion-orden/:id_paciente', async (req, res) => {
  try {
    // Obtiene los datos del formulario

    const { estado, examenes, tipos_muestra } = req.body;
    const id_paciente = req.params.id_paciente;
    
    // Verifica si id_paciente es null
    if (!id_paciente) {
      return res.status(400).send('El valor de id_paciente es nulo o no válido.');
    }

    // Crea una nueva orden de trabajo
    const nuevaOrden = await OrdenTrabajo.create({
      paciente,
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
        estadoMuestra: estado, 
        Fecha_Recepcion: new Date(),
        estadoMuestra: estado,
      });
    }

    res.redirect('/ordenImprimir');
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    res.status(500).send('Error al procesar el formulario')}});
