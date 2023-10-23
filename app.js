const express = require('express');
const app = express();
const sequelize = require('./config/database');
const pacienteRuta = require('./routes/pacienteRuta');
const examenRuta = require('./routes/examenRuta'); // Importa las rutas relacionadas con exámenes
const Paciente = require('./models/paciente');
const Examen = require('./models/examen');
const path = require('path');
//hola
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

// Middleware para manejar rutas relacionadas con pacientes
app.use('/', pacienteRuta);

// Middleware para manejar rutas relacionadas con exámenes
app.use('/examen', examenRuta);

// Nueva ruta para mostrar la vista de vistaPrevia en la ruta raíz (http://localhost:3000)
app.get('/', (req, res) => {
    res.render('preRegistro');
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
