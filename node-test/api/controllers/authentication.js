const { UserService } = require('../services/user-service');
const { InputValidator } = require('../validators/input-validator');

class AuthenticationController {
  constructor(db) {
    this.userService = new UserService(db);
    this.registerUser = this.registerUser.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }
  registerUser(req, res, next) {
    const { name, email, password } = req.body;
    return Promise.all([InputValidator.validateName(name),InputValidator.validateEmail(email),InputValidator.validatePassword(password)])
    .then(() => {
      return this.userService.registerUser(name, email, password)
      .then(token => {
        res.status(201).json({ token });
        return next();
      })
    })
    .catch(err => {
      return next(err);
    });
  }
  logIn(req, res, next) {
    const { email, password } = req.body;
    return InputValidator.validateEmail(email).then(() => InputValidator.validatePassword(password))
    .then(() => {
      return this
      .userService
      .logIn(email, password)
      .then(token => {
        res.json({ token });
        return next();
      });
    })
    .catch(err => {
      return next(err);
    });
    }

    logOut(req, res, next) {
      if (!req.token) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        return next(error)
      }
      return this.userService.logOut(req.token)
      .then(() => {
        res.json({});
        return next();
      })
      .catch(err => {
        return next(err);
      });
    }
  }

module.exports.AuthenticationController = AuthenticationController;
