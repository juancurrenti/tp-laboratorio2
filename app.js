const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
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

// Configuración de express-session
app.use(session({
    secret: 'corva',
    resave: false,
    saveUninitialized: true
}));
// Middleware para inicializar Passport después de la sesión
app.use(passport.initialize());
app.use(passport.session());
// Middleware para procesar datos del formulario
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Passport.js configuración de estrategia local
passport.use(new LocalStrategy(
    {
        usernameField: 'correo_electronico',
        passwordField: 'password',
    },
    async (username, password, done) => {
        try {
            if (!username || !password) {
                return done(null, false, { message: 'Credenciales incorrectas' });
            }

            const user = await User.findOne({ where: { correo_electronico: username } });

            if (!user) {
                return done(null, false, { message: 'Credenciales incorrectas' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return done(null, false, { message: 'Credenciales incorrectas' });
            }

            return done(null, user);
        } catch (error) {
            console.error('Error de autenticación:', error);
            return done(error);
        }
    }
));

// Passport.js serialización y deserialización de usuarios
passport.serializeUser((user, done) => {
    done(null, user.id_Usuario); 
});

passport.deserializeUser(async (id_Usuario, done) => {
    try {
        const user = await User.findByPk(id_Usuario);
        if (!user) {
            done(null, false); 
        } else {
            done(null, user);
        }
    } catch (error) {
        done(error);
    }
});


// Ruta para la vista de inicio de sesión
app.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para procesar el inicio de sesión y generar el token JWT
app.post('/login', passport.authenticate('local', { session: true }), (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user.id_Usuario, rol: user.rol }, 'messicrack'); 
    if (user.rol === 'recepcionista') {
        res.redirect('/recepcionista');
    } else if (user.rol === 'tecnico' || user.rol === 'bioquimico') {
        res.redirect('/tecnico-bioquimico');
    } else if (user.rol === 'admin') {
        res.redirect('/crear-usuario');
    }
});

// Rutas protegidas
app.get('/recepcionista', (req, res) => {
    if (req.isAuthenticated() && (req.user.rol === 'recepcionista' || req.user.rol === 'tecnico' || req.user.rol === 'bioquimico')) {
        res.render('recepcionista');
    } else {
        res.status(403).send('Acceso no autorizado');
    }
});

app.get('/tecnico-bioquimico', (req, res) => {
    if (req.isAuthenticated() && (req.user.rol === 'tecnico' || req.user.rol === 'bioquimico')) {
        res.render('tecnico-bioquimico');
    } else {
        res.status(403).send('Acceso no autorizado');
    }
});

app.get('/crear-usuario', (req, res) => {
    if (req.isAuthenticated() && req.user.rol === 'admin') {
        res.render('crear-usuario');
    } else {
        res.status(403).send('Acceso no autorizado');
    }
}); 

app.post('/admin/crear-usuario', async (req, res) => {
    if (req.isAuthenticated() && req.user.rol === 'admin') {
        const { nombre, correo_electronico, password, rol } = req.body;

        try {
            const existingUser = await User.findOne({ where: { correo_electronico } });

            if (existingUser) {
                // Si el usuario ya existe, muestra un mensaje en la vista Pug
                res.render('crear-usuario', { error: 'El correo electrónico ya está en uso. Ingrese otro.' });
            } else {
                const hashedPassword = bcrypt.hashSync(password, 10);
                await User.create({
                    nombre_usuario: nombre, // Asegúrate de usar el nombre de columna correcto
                    correo_electronico,
                    password: hashedPassword,
                    rol,
                });
                res.redirect('/admin/crear-usuario');
            }
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            res.status(500).send('Error al crear el usuario');
        }
    } else {
        res.status(403).send('Acceso no autorizado');
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
