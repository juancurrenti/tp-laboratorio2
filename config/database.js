const { Sequelize } = require('sequelize');
Sequelize.Model.sync = () => Promise.resolve();
// Configura la conexión a la base de datos
const sequelize = new Sequelize({
  dialect: 'mysql', // Especifica la base de datos que estás utilizando
  host: 'localhost', // Dirección del servidor de la base de datos
  username: 'root', // Nombre de usuario de la base de datos
  password: '', // Contraseña de la base de datos
  database: 'clinica', // Nombre de la base de datos
});

// Prueba la conexión a la base de datos
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

// Exporta la instancia de Sequelize y la función para probar la conexión
module.exports =  sequelize, testDatabaseConnection ;
