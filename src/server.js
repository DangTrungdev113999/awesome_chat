import express from 'express';
import ConnectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';

// init app
let app = express();

// connect to Mongo
ConnectDB();

// config view engine
configViewEngine(app);

// init all routes
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`running on ${process.env.APP_PORT}: ${process.env.APP_HOST}`);
})
