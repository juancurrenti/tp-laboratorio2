const express = require("express");
const router = express.Router();
const OrdenTrabajo = require("../models/ordenes_trabajo");
const Muestra = require("../models/muestra");
const Examen = require("../models/examen");
const OrdenesExamenes = require("../models/ordenes_examen");
// Ruta para buscar un paciente y mostrar sus órdenes de trabajo
router.get("/ordenes", (req, res) => {
  res.render("buscarPacientesOrdenes"); // Renderiza la vista inicial para buscar paciente y órdenes
});

// Ruta para manejar la búsqueda de órdenes de trabajo por id_paciente
router.post("/ordenes", async (req, res) => {
  try {
    const dniPaciente = req.body.dniPaciente;
    console.log("ID del Paciente:", dniPaciente);

    // Buscar órdenes de trabajo por id_paciente
    const ordenesTrabajo = await OrdenTrabajo.findAll({
      where: { dni: dniPaciente },
      attributes: [
        "id_Orden",
        "id_Paciente",
        "dni",
        "Fecha_Creacion",
        "Fecha_Entrega",
        "estado",
      ],
    });

    if (ordenesTrabajo.length === 0) {
      // No se encontraron órdenes de trabajo para el paciente
      res.json({
        message: "No se encontraron órdenes de trabajo para el paciente.",
      });
    } else {
      // Se encontraron órdenes de trabajo para el paciente
      res.json(ordenesTrabajo); // Enviar las órdenes de trabajo en formato JSON
    }
  } catch (error) {
    console.error("Error al buscar órdenes de trabajo:", error);
    res.status(500).json({ error: "Error al buscar órdenes de trabajo" });
  }
});
// Ruta para mostrar el formulario de modificación de órdenes de trabajo
router.get("/crear-modificar-orden/:idOrden", async (req, res) => {
  try {
    const tiposMuestra = [
      { value: "sangre", label: "Sangre" },
      { value: "orina", label: "Orina" },
      { value: "heces", label: "Heces" },
      { value: "liquidoCefaloraquideo", label: "Líquido Cefalorraquídeo" },
      { value: "saliva", label: "Saliva" },
      { value: "nasofaringea", label: "Secreción Nasofaríngea" },
    ];
    const examenes = await Examen.findAll();
    const { idOrden } = req.params;
    // Buscar la orden de trabajo específica incluyendo las muestras sin las marcas de tiempo
    const ordenTrabajoExistente = await OrdenTrabajo.findByPk(idOrden, {
      include: [
        {
          model: Muestra,
          attributes: ["id_Muestra", "Tipo_Muestra"],
        },{
          model: OrdenesExamenes,
          attributes: ["id_OrdenExamen", "id_examen",],
        }
      ],
    });
    console.log('Las ordenes de trabajo asociadas son:',ordenTrabajoExistente.OrdenesExamenes);
    // Si la orden de trabajo no existe, devuelve un mensaje de error
    if (!ordenTrabajoExistente) {
      return res.status(404).send("Orden de Trabajo no encontrada");
    }
    res.render("crearModificarOrden", { tiposMuestra, ordenTrabajoExistente, examenes });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener la orden de trabajo.");
  }
});

// Ruta para procesar la creación/modificación de órdenes de trabajo
router.post("/crear-modificar-orden/:idOrden", async (req, res) => {
  try {
    const { idOrden } = req.params;
    const { estado, idPaciente, tipos_muestra, examenesSelectedIds } = req.body;

    const ordenTrabajoExistente = await OrdenTrabajo.findByPk(idOrden);
    const examenesSelectedIdsArray = examenesSelectedIds
      .split(",")
      .map((id_examen) => parseInt(id_examen));

    if (ordenTrabajoExistente) {
      ordenTrabajoExistente.estado = estado;
      await ordenTrabajoExistente.save();

      // Verificar si se han seleccionado tipos de muestra
      if (Array.isArray(tipos_muestra) && tipos_muestra.length > 0) {
        for (const tipoMuestra of tipos_muestra) {
          const estadoValue = req.body[`estado_${tipoMuestra}`];
          // Crear y guardar la muestra en la base de datos
          const nuevaMuestra = await Muestra.create({
            id_Orden: idOrden,
            id_Paciente: idPaciente,
            Fecha_Recepcion: new Date(),
            Tipo_Muestra: tipoMuestra,
            estado: estadoValue,
          });
          console.log("Muestra creada:", nuevaMuestra);
        }
      } else {
        console.log("No se seleccionaron tipos de muestra.");
      }

      // Continúa con el procesamiento de exámenes
      for (const examenId of examenesSelectedIdsArray) {
        await OrdenesExamenes.create({
          id_Orden: idOrden,
          id_examen: examenId,
        });
      }
      res.send("Orden de trabajo y muestras procesadas con éxito.");
    } else {
      res.status(404).send("Orden de trabajo no encontrada.");
    }
  } catch (error) {
    console.error(
      "Error al procesar la orden de trabajo y las muestras:",
      error
    );
    res.status(500).send("Error interno del servidor");
  }
});

// Ruta para cancelar una orden de trabajo
router.get("/cancelar-orden/:idOrden", async (req, res) => {
  try {
    const { idOrden } = req.params;

    // Buscar la orden de trabajo específica
    const ordenTrabajoExistente = await OrdenTrabajo.findByPk(idOrden);

    // Si la orden de trabajo no existe, devuelve un mensaje de error
    if (!ordenTrabajoExistente) {
      return res.status(404).send("Orden de Trabajo no encontrada");
    }

    // Renderiza la vista para ingresar la descripción de la cancelación
    res.render("cancelarOrden", { ordenTrabajoExistente });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cancelar la orden de trabajo.");
  }
});

// Ruta para procesar la cancelación de una orden de trabajo
router.post("/cancelar-orden/:idOrden", async (req, res) => {
  try {
    const { idOrden } = req.params;
    const { descripcionCancelacion } = req.body;

    // Buscar la orden de trabajo existente
    const ordenTrabajoExistente = await OrdenTrabajo.findByPk(idOrden);

    if (ordenTrabajoExistente) {
      // Si existe, actualiza el estado a "Cancelada" y agrega la descripción
      ordenTrabajoExistente.estado = "Cancelada";
      ordenTrabajoExistente.descripcionCancelacion = descripcionCancelacion;
      await ordenTrabajoExistente.save();

      console.log("Orden de trabajo cancelada con éxito.");
    } else {
      // Si no existe, devuelve un mensaje de error
      return res.status(404).send("Orden de Trabajo no encontrada");
    }

    // Redirecciona a la página principal de órdenes después de cancelar
    res.redirect("/buscarOrdenes/ordenes");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Error al procesar la cancelación de la orden de trabajo.");
  }
});

module.exports = router;
