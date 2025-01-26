const express = require('express');
const AppDataSource = require('./src/config/database');
const { env } = require("./src/config/env.config")
const app = express();

// Middleware para JSON parsing
app.use(express.json());

// Importação de rotas
const userRoutes = require('./src/routes/user.routes');

// Registro das rotas
app.use('/user', userRoutes);

// Início do servidor
AppDataSource.initialize()
  .then(() => {
    console.log('📦 Database connection has been initialized successfully!');

    // Iniciar o servidor somente após a conexão bem-sucedida
    app.listen(env.PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error during database initialization:', error.message);
    process.exit(1); // Finaliza o processo em caso de erro
  });