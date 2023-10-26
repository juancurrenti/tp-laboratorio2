const express = require('express');
const app = express();
const sequelize = require('./config/database');
const pacienteRuta = require('./routes/pacienteRuta');
const determinacionesRuta = require('./routes/determinacionesRuta');
const examenRuta = require('./routes/examenRuta'); 
const OrdenesTrabajoRuta = require('./routes/ordenes_trabajoRuta');
const valoresRefRuta = require('./routes/valoresRefRuta');
const tiposMuestra = require('./public/js/tiposMuestra');
const Paciente = require('./models/paciente');
const Examen = require('./models/examen');
const OrdenesTrabajo = require('./models/ordenes_trabajo');
const Determinacion = require('./models/determinacion');
const ValoresReferencia = require ('./models/valoresReferencia');
const path = require('path');

// Configuración de la vista
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// Middleware para servir archivos estáticos desde la carpeta '/public'
app.use('/public', express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        res.set('Content-Type', 'text/css'); // Configura el tipo de contenido para archivos CSS
    },
}));

app.use(express.urlencoded({ extended: true }));

// Nueva ruta para mostrar la vista de selección de tipo de usuario en la ruta raíz (http://localhost:3000)
app.get('/', (req, res) => {
    res.render('inicio');
});

// Ruta para ingresar como administrativo
app.get('/ingresar/administrativo', (req, res) => {
    res.render('busquedaPaciente'); // Redirige a la vista de búsqueda de pacientes
});

// Ruta para ingresar como personal de salud
app.get('/ingresar/salud', (req, res) => {
    // Agrega el código para autenticar al personal de salud
    res.render('crearExamen'); // Redirige a la vista de personal de salud
});

// Middleware para manejar rutas relacionadas con pacientes
app.use('/', pacienteRuta);
// Middleware para manejar rutas relacionadas con exámenes
app.use('/examen', examenRuta);
// Middleware para manejar rutas relacionadas con determinaciones
app.use('/determinacion', determinacionesRuta);
// Middleware para manejar rutas relacionadas con valores de referencia
app.use('/valoresreferencia', valoresRefRuta);
// Ruta para mostrar la vista de generación de orden
app.get('/generar-orden/:id_paciente/:nombre/:apellido/:dni', (req, res) => {
    const tiposMuestra = [
        { value: "sangre", label: "Sangre" },
        { value: "orina", label: "Orina" },
        { value: "heces", label: "Heces" },
        { value: "liquidoCefaloraquideo", label: "Líquido Cefalorraquídeo" },
        { value: "saliva", label: "Saliva" },
        { value: "nasofaringea", label: "Secreción Nasofaríngea" }
    ];

    const { id_paciente, nombre, apellido, dni } = req.params; 

    res.render('generarOrden', { tiposMuestra, id_paciente, nombre, apellido, dni }); 
});
// Sincronización de modelos con la base de datos y arranque del servidor en el puerto 3000
sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log('Servidor en ejecución en el puerto 3000');
        });
    })
    .catch((error) => {
        console.error('Error al sincronizar modelos con la base de datos:', error);
    });
