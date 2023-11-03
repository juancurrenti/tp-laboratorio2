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
const modificarValrefRuta = require('./routes/modificarValrefRuta');
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

// Configuración de express-session
app.use(session({
    secret: 'corva',
    resave: false,
    saveUninitialized: true
}));

// Middleware para inicializar Passport después de la sesión
app.use(passport.initialize());
app.use(passport.session());

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
app.get('/', (req, res) => {
    res.render('login');
});
app.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: true }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            const errorMessage = 'Email o contraseña incorrectos. Intente nuevamente.';
            return res.render('login', { message: errorMessage });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            const token = jwt.sign({ id: user.id_Usuario, rol: user.rol }, 'messicrack');
            if (user.rol === 'recepcionista') {
                return res.redirect('/recepcionista');
            } else if (user.rol === 'tecnico') {
                return res.redirect('/tecnico');
            } else if (user.rol === 'bioquimico') {
                return res.redirect('/bioquimico');
            } else if (user.rol === 'admin') {
                return res.redirect('/admin');
            }
        });
    })(req, res, next);
});

app.get('/ingresar/administrativo', (req, res) => {
    res.render('busquedaPaciente'); // Redirige a la vista de búsqueda de pacientes
});

// Rutas protegidas
app.get('/recepcionista', (req, res) => {
    if (req.isAuthenticated() && (req.user.rol === 'recepcionista' || req.user.rol === 'tecnico' || req.user.rol === 'bioquimico' || req.user.rol === 'admin')) {
        res.render('recepcionista');
    } else {
        res.status(403).send('Acceso no autorizado');
    }
});


app.get('/tecnico', (req, res) => {
    if (req.isAuthenticated() && (req.user.rol === 'tecnico' || req.user.rol === 'bioquimico' || req.user.rol==='admin')) {
        res.render('tecnico');
    } else {
        res.status(403).send('Acceso no autorizado');
    }
});
app.get('/bioquimico', (req, res) => {
    if(req.isAuthenticated() && (req.user.rol === 'bioquimico' || req.user.rol === 'admin')){
        res.render('bioquimico');
    }else{
        res.status(403).send('Acceso no autorizado');
    }
})
//vista admin principal
app.get('/admin', (req, res) => {
    if (req.isAuthenticated() && req.user.rol === 'admin') {
        res.render('admin');
    } else {
        res.status(403).send('Acceso no autorizado');
    }
});
//vista admin para crear un usuario
app.get('/admin/crear-usuario', (req, res) => {
    if (req.isAuthenticated() && req.user.rol === 'admin') {
        res.render('crear-usuario');
    } else {
        res.status(403).send('Acceso no autorizado');
    }
});
//vista admin para actualizar un usuario
app.get('/admin/actualizarUsuarioAdm', (req, res) => {
    if (req.isAuthenticated() && req.user.rol === 'admin') {
        res.render('actualizarUsuarioAdm');
    } else {
        res.status(403).send('Acceso no autorizado');
    }
});
app.get('/admin/actualizarUsuarioAdm/:nombre', async (req, res) => {
    if (req.isAuthenticated() && req.user.rol === 'admin') {
        try {
            const nombreBusqueda = req.params.nombre;
            const usuario = await User.findOne({ where: { nombre_usuario: nombreBusqueda } });

            if (usuario) {
                // Encontraste al usuario, envía la respuesta JSON
                res.json({ usuario });
            } else {
                // Usuario no encontrado, envía un mensaje como respuesta JSON
                res.json({ mensaje: 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            res.status(500).json({ error: 'Error en la búsqueda' });
        }
    } else {
        res.status(403).send('Acceso no autorizado');
    }
});
app.post('/admin/actualizar-usuario', async (req, res) => {
    try {
      // Obtén los datos del formulario enviado por el cliente
      const nombreBusqueda = req.body.nombreBusqueda;
      const nombre = req.body.nombre;
      const correoElectronico = req.body.correo_electronico;
      const password = req.body.password; // Contraseña sin cifrar
      const rol = req.body.rol;
      const usuarioExistente = await User.findOne({ where: { nombre_usuario: nombreBusqueda } });
  
      if (usuarioExistente) {
        // Actualiza los datos del usuario existente
        usuarioExistente.nombre_usuario = nombre;
        usuarioExistente.correo_electronico = correoElectronico;
  
        // Cifra la nueva contraseña si se proporcionó
        if (password) {
          const hashedPassword = bcrypt.hashSync(password, 10);
          usuarioExistente.password = hashedPassword;
        }
  
        usuarioExistente.rol = rol;
  
        await usuarioExistente.save();
  
        console.log('Usuario actualizado exitosamente');
        res.render('actualizarUsuarioAdm', { mensaje: `Usuario ${nombre} actualizado exitosamente` });
      } else {
        res.render('actualizarUsuarioAdm', { mensaje: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error en el servidor: ' + error);
      res.status(500).send('Error en el servidor');
    }
  });
  app.delete('/admin/eliminarUsuarioAdm/:nombre', async (req, res) => {
    const nombreUsuario = req.params.nombre;
  
    // Agregar lógica para buscar y eliminar el usuario en la base de datos
    try {
      const usuario = await User.findOne({ where: { nombre_usuario: nombreUsuario } });
  
      if (usuario) {
        // Elimina el usuario de la base de datos
        await usuario.destroy();
        res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
      } else {
        res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error en el servidor: ' + error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });

  app.post('/admin/crear-usuario', async (req, res) => {
    if (req.isAuthenticated() && req.user.rol === 'admin') {
        const { nombre, correo_electronico, password, rol } = req.body;

        try {
            const existingUser = await User.findOne({ where: { correo_electronico } });

            if (existingUser) {
                // Si el usuario ya existe, muestra un mensaje en la vista Pug
                res.render('crear-usuario', { mensaje: null, error: 'El correo electrónico ya está en uso. Ingrese otro.' });
            } else {
                const hashedPassword = bcrypt.hashSync(password, 10);
                await User.create({
                    nombre_usuario: nombre, // Asegúrate de usar el nombre de columna correcto
                    correo_electronico,
                    password: hashedPassword,
                    rol,
                });
                // Establece el mensaje y redirige a la misma página para mostrarlo
                res.render('crear-usuario', { mensaje: 'Usuario creado exitosamente', error: null });
            }
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            res.status(500).send('Error al crear el usuario');
        }
    } else {
        res.status(403).send('Acceso no autorizado');
    }
});
// Middleware para verificar el acceso de roles
function checkRole(roles) {
    return (req, res, next) => {
        if (req.isAuthenticated() && (roles.includes(req.user.rol) || req.user.rol === 'admin')) {
            // Si el usuario tiene uno de los roles específicos o es un admin, permite el acceso.
            next();
        } else {
            res.status(403).send('Acceso no autorizado');
        }
    };
}
// Middleware para manejar rutas relacionadas con pacientes
app.use('/', pacienteRuta);
app.use('/buscarOrdenes', buscarOrdenesRuta);
app.use('/orden', OrdenesTrabajoRuta);

app.use('/examen',checkRole(['tecnico', 'bioquimico', 'admin']), examenRuta);
app.use('/determinacion', checkRole(['tecnico', 'bioquimico', 'admin']), determinacionesRuta);
app.use('/valoresreferencia', checkRole(['tecnico', 'bioquimico', 'admin']), valoresRefRuta);
app.use('/modificar-examen', checkRole(['tecnico', 'bioquimico', 'admin']), modificarExamenRuta);
app.use('/modificar-determinacion', checkRole(['tecnico', 'bioquimico', 'admin']), modificarDeterminacionRuta);
app.use('/buscar-valores', checkRole(['tecnico', 'bioquimico', 'admin']), modificarValrefRuta);
//Cierre de sesion.
app.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        console.log('sesion cerrada');
        res.redirect('/'); // Redirige al usuario a la página de inicio o a otra página deseada
    });
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
