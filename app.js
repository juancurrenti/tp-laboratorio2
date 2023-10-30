const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const pacienteRuta = require('./routes/pacienteRuta');
const determinacionesRuta = require('./routes/determinacionesRuta');
const examenRuta = require('./routes/examenRuta'); 
const OrdenesTrabajoRuta = require('./routes/ordenes_trabajoRuta');
const valoresRefRuta = require('./routes/valoresRefRuta');
const modificarExamenRuta = require('./routes/modificarExamenRuta');
const modificarDeterminacionRuta = require('./routes/modificarDeterminacionRuta');
const buscarOrdenesRuta = require('./routes/buscarOrdenesRuta');
const modificarValrefRuta = require ('./routes/modificarValrefRuta');
const path = require('path');
//hola
// Configuración de la vista
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(router);
// Middleware para servir archivos estáticos desde la carpeta '/public'
app.use('/public', express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        res.set('Content-Type', 'text/css'); // Configura el tipo de contenido para archivos CSS
    },
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
app.use('/buscarOrdenes', buscarOrdenesRuta);

// Middleware para manejar rutas relacionadas con exámenes
app.use('/examen', examenRuta);
app.use('/determinacion', determinacionesRuta);
app.use('/valoresreferencia', valoresRefRuta);
app.use('/orden', OrdenesTrabajoRuta);
app.use('/modificar-examen', modificarExamenRuta);
app.use('/modificar-determinacion', modificarDeterminacionRuta);
app.use('/buscar-valores', modificarValrefRuta);


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
