const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const mysql = require('mysql');
const port = process.env.PORT || 4000;

// Configura la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'laboratorio',
});

// Conecta a la base de datos
db.connect((err) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      throw err;
    }
    console.log('Conexión a la base de datos MySQL exitosa');
  });
  
  app.use(bodyParser.json());
  app.use(express.static(__dirname));

  // Ruta para servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
  