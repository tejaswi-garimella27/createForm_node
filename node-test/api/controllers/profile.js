const { UserService } = require('../services/user-service');

class ProfileController {

  constructor(db) {
    this.userService = new UserService(db);
    this.getUserProfile = this.getUserProfile.bind(this);
  }

  getUserProfile(req, res, next) {
    if (!req.token) {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      return next(error)
    }
    this.userService
    .getUserProfileByToken(req.token)
    .then(user => {
      res.json({ email: user.email, name: user.name });
      return next();
    })
    .catch(next);
  }
}

module.exports.ProfileController = ProfileController;
