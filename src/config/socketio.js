import passportSocketio from "passport.socketio";

let configSocketio = (io, cookieParser, sessionStore) => {
  io.use(
    passportSocketio.authorize({
      cookieParser: cookieParser,
      key: process.env.SESSION_KEY,
      secret: process.env.SESSION_SECRET,
      store: sessionStore,
      success: (data, accept) => {
        if (!data.user.logged_in) {
          return accept("invial user", false);
        }
        return accept(null, true);
      },
      fail: (data, message, error, accept) => {
        if (error) {
          console.log("failed connection to socket.io:", message);
          return accept(new Error(message, false));
        }
      }
    })
  );
};

module.exports = configSocketio;
