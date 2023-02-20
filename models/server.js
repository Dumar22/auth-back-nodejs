const express = require('express');
const cors = require('cors');

const { dbConnection }= require('../database/config')



class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.usuariosPath = '/api/usuarios'

    //conección con base de datos
    this.conectarDB();

    //Middlewares
    this.middlewares();

    //Rutas
    this.routes();
  }

  async conectarDB() {
    await dbConnection()
  }

  middlewares() {
    //CORS
    this.app.use(cors());
    
    //Lectura y parseo del body
    this.app.use(express.json());
    
    //Directorio público
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use( this.usuariosPath, require('../routes/usuarios'))
  }
  
  listen() {
      this.app.listen( this.port , () => {
      console.log(`Servidor Funcionando por el puerto ${this.port}`)
    } )
}

}




module.exports = Server;