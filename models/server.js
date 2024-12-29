
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const tasksRoutes = require('../routes/tareas'); 

const { dbConnectiion } = require('../database/config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000; 
    this.paths = {
      tasks: '/api/tasks', 
    };

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async conectarDB() {
    try {
      await dbConnectiion();
      console.log('Base de datos conectada exitosamente');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
      process.exit(1); 
    }
  }

  middlewares() {
    this.app.use(cors()); // Habilitar CORS
    this.app.use(express.json()); // Habilitar JSON para solicitudes
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Swagger
  }

  routes() {
    this.app.use(this.paths.tasks, tasksRoutes); // Rutas de tareas
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto ${this.port}`);
    });
  }
}

module.exports = Server;
