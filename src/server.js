import express from 'express';
import ConnectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import connectSession from './config/session';

// init app
let app = express();

// connect to Mongo
ConnectDB();

// config session
connectSession(app);

// config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

// Enable flash
app.use(connectFlash());

// init all routes
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`running on ${process.env.APP_PORT}: ${process.env.APP_HOST}`);
})
