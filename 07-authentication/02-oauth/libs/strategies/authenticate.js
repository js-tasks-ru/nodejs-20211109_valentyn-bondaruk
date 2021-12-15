const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  try {
    let currentUser = await User.findOne({email});

    if (currentUser) {
      return done(null, currentUser);
    }

    currentUser = await User.create({
      email, displayName,
    });
    done(null, currentUser);
  } catch (err) {
    done(err);
  }
};
