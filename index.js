const cors = require("cors");
const express = require('express');
const AppDataSource = require('./src/config/database');
const { env } = require("./src/config/env.config")
const app = express();

app.use(express.json());
app.use(cors({
  origin: (_, cb) => {
    cb(null, true);
  },
  credentials: true,
}));

const userRoutes = require('./src/routes/user.routes');
const mentoringRoutes = require('./src/routes/mentoring.routes');
const jobRoutes = require('./src/routes/job.routes');

app.use('/user', userRoutes);
app.use('/mentoring', mentoringRoutes);
app.use('/job', jobRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Database connection has been initialized successfully!');

    app.listen(env.PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error during database initialization:', error.message);
    process.exit(1);
  });