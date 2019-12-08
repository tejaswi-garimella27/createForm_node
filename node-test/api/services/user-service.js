const uuid = require('uuid');
const crypto = require('crypto');
const q = require('q')

function hash(str) {
  const hmac = crypto.createHmac('sha256', process.env.HASH_SECRET || 'test-secret');
  hmac.update(str);
  return hmac.digest('hex');
}

function createToken() {
  return 'token.' + uuid.v4().split('-').join('');
}

class UserService {
  constructor(db) {
    this.db = db;
    this.getUserProfileByToken = this.getUserProfileByToken.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  /**
   * Registers a user and returns it's token
   * @param {String} name
   * @param {String} email
   * @param {String} password
   * @return {Promise} resolves to user's token or rejects with Error that has statusCodes
   */
  registerUser(name, email, password) {
    return this.db
    .collection('ATUsers')
    .findOne({ email })
    .then(user => {
      if (user) {
        const error = new Error(`${email} already exists.`);
        error.statusCode = 400;
        throw error;
      } else {
        const token = {
          value: createToken(),
          created: new Date()
        };
        return this.db
        .collection('ATUsers')
        .insertOne({ password: hash(password), name, email, token }).then(() => token.value);
      }
    })
  }

  /**
   * Gets a user profile by token
   * @param {String} token
   * @return {Promise} that resolves to object with email and name of user or rejects with error
   */
  getUserProfileByToken(token) {
    return this.db.collection('ATUsers')
    .findOne({ 'token.value': token })
    .then(doc => {
      if (doc) {
        return {
          email: doc.email,
          name: doc.name
        };
      }
      const error = new Error('Invalid Token -Profile not found');
      error.statusCode = 404;
      throw error;
    })
  }

  /**
   * Log in a user to get his token
   * @param {String} email
   * @param {String} password
   * @return {Promise} resolves to token or rejects to error
   */
  logIn(email, password) {
    return this.db.collection('ATUsers')
    .findOne({ password: hash(password), email })
    .then(doc => {
      if (!doc) {
        const error = new Error('Invalid credentials');
        error.statusCode = 400;
        throw error;
      }
      const token = {
        value: createToken(),
        created: new Date()
      };
      // update the token
      return this.db.collection('ATUsers')
      .updateOne({ _id: doc._id }, { $set: { token } })
      .then(() => token.value);
    })
  }

  logOut(token) {
    return this.db.collection('ATUsers')
    .updateOne({ 'token.value': token }, { $unset: { token: '' } })
  }
}

module.exports.UserService = UserService;


