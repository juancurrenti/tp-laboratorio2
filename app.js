const express = require('express');
const app = express();
const sequelize = require('./config/database');
const pacienteRuta = require('./routes/pacienteRuta'); 
const Paciente = require('./models/paciente');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use('/', pacienteRuta); 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/ingresarPaciente.html');
});

// Ruta para procesar el formulario
app.post('/guardar-paciente', async (req, res) => {
    try {
        // Obtiene los datos del formulario
        const { nombre, apellido, dni,  email, telefono, fecha_nacimiento, genero, embarazo,
            diagnostico} = req.body;

        // Guarda los datos en la base de datos
        await Paciente.create({
            nombre,
            apellido,
            dni,
            email,
            telefono,
            fecha_nacimiento,
            genero,
            embarazo,
            diagnostico
        });

        // Muestra un mensaje por consola
        console.log('Datos del paciente guardados con éxito:', nombre, apellido, dni);

        // Redirige o muestra un mensaje de éxito
        res.redirect('/formulario'); // Puedes redirigir a donde desees o mostrar un mensaje de éxito
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar el paciente en la base de datos.');
    }
});

sequelize.sync() // Sincroniza los modelos con la base de datos
    .then(() => {
        app.listen(3000, () => {
            console.log('Servidor en ejecución en el puerto 3000');
        });
    })
    .catch((error) => {
        console.error('Error al sincronizar modelos con la base de datos:', error);
    });
