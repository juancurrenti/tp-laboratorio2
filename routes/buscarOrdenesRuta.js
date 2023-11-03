const express = require('express');
const router = express.Router();
const OrdenTrabajo = require('../models/ordenes_trabajo');
const Muestra = require('../models/muestra');

// Ruta para buscar un paciente y mostrar sus órdenes de trabajo
router.get('/ordenes', (req, res) => {
  
  res.render('buscarPacientesOrdenes'); // Renderiza la vista inicial para buscar paciente y órdenes
});

// Ruta para manejar la búsqueda de órdenes de trabajo por id_paciente
router.post('/ordenes', async (req, res) => {
  try {
    const idPaciente = req.body.idPaciente;
    console.log('ID del Paciente:', idPaciente);
    
    // Buscar órdenes de trabajo por id_paciente
    const ordenesTrabajo = await OrdenTrabajo.findAll({
      where: { id_paciente: idPaciente },
      attributes: ['id_Orden', 'id_Paciente', 'Fecha_Creacion', 'Fecha_Entrega', 'estado'],
    });

    if (ordenesTrabajo.length === 0) {
      // No se encontraron órdenes de trabajo para el paciente
      res.json({ message: 'No se encontraron órdenes de trabajo para el paciente.' });
    } else {
      // Se encontraron órdenes de trabajo para el paciente
      res.json(ordenesTrabajo); // Enviar las órdenes de trabajo en formato JSON
    }
  } catch (error) {
    console.error('Error al buscar órdenes de trabajo:', error);
    res.status(500).json({ error: 'Error al buscar órdenes de trabajo' });
  }
});
// Ruta para mostrar el formulario de modificación de órdenes de trabajo
router.get('/crear-modificar-orden/:idOrden', async (req, res) => {
  try {
    const { idOrden } = req.params;

    // Buscar la orden de trabajo específica incluyendo las muestras sin las marcas de tiempo
    const ordenTrabajoExistente = await OrdenTrabajo.findByPk(idOrden, {
      include: [{
        model: Muestra,
        attributes: ['id_Muestra', 'Tipo_Muestra'], // Especifica las columnas que deseas incluir
      }],
    });

    // Si la orden de trabajo no existe, devuelve un mensaje de error
    if (!ordenTrabajoExistente) {
      return res.status(404).send('Orden de Trabajo no encontrada');
    }

    res.render('crearModificarOrden', {
      ordenTrabajoExistente,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la orden de trabajo.');
  }
});


// Ruta para procesar la modificación de órdenes de trabajo
router.post('/crear-modificar-orden/:idOrden', async (req, res) => {
  try {
    const { idOrden } = req.params;
    const { estado, muestras } = req.body;

    // Buscar la orden de trabajo existente
    const ordenTrabajoExistente = await OrdenTrabajo.findByPk(idOrden, {
      include: [Muestra], // Asegúrate de incluir el modelo Muestra
    });

    if (ordenTrabajoExistente) {
      // Si existe, actualiza el estado
      ordenTrabajoExistente.estado = estado;
      await ordenTrabajoExistente.save();
    // Actualiza las muestras según la información del formulario
    if (muestras && muestras.length > 0) {
      const muestrasActualizadas = JSON.parse(muestras);
      for (const muestra of muestrasActualizadas) {
        const muestraExistente = await Muestra.findByPk(muestra.id_Muestra);
        if (muestraExistente) {
          muestraExistente.Resultado = muestra.Resultado;
          // Ajusta otros campos según tus necesidades
          await muestraExistente.save();
        }
      }
    }

      console.log('Estado de la orden de trabajo y muestras modificados con éxito.');
    } else {
      // Si no existe, devuelve un mensaje de error
      return res.status(404).send('Orden de Trabajo no encontrada');
    }

    res.redirect('/buscarOrdenes/ordenes');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar la modificación de la orden de trabajo y las muestras.');
  }
});

// Ruta para cancelar una orden de trabajo
router.get('/cancelar-orden/:idOrden', async (req, res) => {
  try {
    const { idOrden } = req.params;

    // Buscar la orden de trabajo específica
    const ordenTrabajoExistente = await OrdenTrabajo.findByPk(idOrden);

    // Si la orden de trabajo no existe, devuelve un mensaje de error
    if (!ordenTrabajoExistente) {
      return res.status(404).send('Orden de Trabajo no encontrada');
    }

    // Renderiza la vista para ingresar la descripción de la cancelación
    res.render('cancelarOrden', { ordenTrabajoExistente });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cancelar la orden de trabajo.');
  }
});

// Ruta para procesar la cancelación de una orden de trabajo
router.post('/cancelar-orden/:idOrden', async (req, res) => {
  try {
    const { idOrden } = req.params;
    const { descripcionCancelacion } = req.body;

    // Buscar la orden de trabajo existente
    const ordenTrabajoExistente = await OrdenTrabajo.findByPk(idOrden);

    if (ordenTrabajoExistente) {
      // Si existe, actualiza el estado a "Cancelada" y agrega la descripción
      ordenTrabajoExistente.estado = 'Cancelada';
      ordenTrabajoExistente.descripcionCancelacion = descripcionCancelacion;
      await ordenTrabajoExistente.save();

      console.log('Orden de trabajo cancelada con éxito.');
    } else {
      // Si no existe, devuelve un mensaje de error
      return res.status(404).send('Orden de Trabajo no encontrada');
    }

    // Redirecciona a la página principal de órdenes después de cancelar
    res.redirect('/buscarOrdenes/ordenes');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar la cancelación de la orden de trabajo.');
  }
});


module.exports = router;
