const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
  {
    session: false,
    usernameField: 'email'
  },
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {

      if (err) { return done(err); }

      if (!user) { return done(null, false, 'Нет такого пользователя'); }

      user.checkPassword(password)
        .then(isValid => {
          if (isValid) { return done(null, user); }
          return done(null, false, 'Неверный пароль');
        })
        .catch(err => done(err));
    });
  }
);
