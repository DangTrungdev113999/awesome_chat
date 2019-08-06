import session from 'express-session';
import connectMongo from 'connect-mongo';

let MongoStore = connectMongo(session);

/**
 * this variable is where save session, in this case is mongo
 */
let sessionStore = new MongoStore({
  url: `${process.env.DB_CONNECT}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoReconnect: true,
  // autoRemove: 'native'
})

let configSession = app => {
  app.use(session({
    key: "express.sid",
    secret: "mySecret",
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  }));
};

module.exports = configSession;