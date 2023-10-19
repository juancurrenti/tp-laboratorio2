const express = require('express');
const app = express();
const sequelize = require('./config/database');
const pacienteRuta = require('./routes/pacienteRuta');
const Paciente = require('./models/paciente');
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

// Middleware para manejar rutas relacionadas con pacientes
app.use('/', pacienteRuta);


app.get('/', (req, res) => {
    res.render('busquedaPaciente'); 
});

// Controlador para la ruta de guardar paciente
app.post('/guardar-paciente', async (req, res) => {
    try {
        const {
            dni, 
            nombre,
            apellido,
            email,
            telefono,
            fecha_nacimiento,
            genero,
            embarazo,
            diagnostico,
        } = req.body;
        const fecha_registro = new Date();

        const existingPaciente = await Paciente.findOne({ where: { dni } });

        if (existingPaciente) {
            // Si el paciente existe, actualiza los datos
            await existingPaciente.update({
                nombre,
                apellido,
                email,
                telefono,
                fecha_nacimiento,
                genero,
                embarazo,
                diagnostico,
            });
            console.log('Datos del paciente actualizados con éxito:', nombre, apellido, dni);
        } else {
            // Si no se encuentra un paciente con el DNI, crea uno nuevo
            await Paciente.create({
                nombre,
                apellido,
                dni,
                email,
                telefono,
                fecha_nacimiento,
                genero,
                embarazo,
                diagnostico,
                fecha_registro, // Agrega la fecha de registro
            });
            console.log('Datos del paciente guardados con éxito:', nombre, apellido, dni);
        }

        res.redirect('/'); // Redirige de vuelta a la página principal
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar el paciente en la base de datos.');
    }
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
