const LocalStrategy = require('passport-local').Strategy;
const User = require('./../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async (email, password, done) => {
      try {
        const currentUser = await User.findOne({email});

        if (!currentUser) {
          return done(null, false, 'Нет такого пользователя');
        }

        const isPasswordValid = await currentUser.checkPassword(password);

        if (!isPasswordValid) {
          return done(null, false, 'Неверный пароль');
        }

        return done(null, currentUser);
      } catch (error) {
        done(error);
      }
    },
);
