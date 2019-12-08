class InputValidator {

  static validateName(name) {
    if (typeof name === 'string' && name.length > 0) {
      return Promise.resolve(true);
    }
    return Promise.reject({ statusCode: 400, message: 'Name must be a valid non empty string.' });
  
  }

  static validateEmail(email) {
    const validateEmailRegEx =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(!validateEmailRegEx.test(email)) 
    return Promise.reject({ statusCode: 400, message: `${email} is not a valid email` })
    return Promise.resolve(true)
  }

  static validatePassword(password) {
    if (typeof password === 'string' && password.length > 0) {
      return Promise.resolve(true);
    }
    return Promise.reject({ statusCode: 400, message: 'password must be a valid non empty string ' });
  }
  
}

module.exports.InputValidator = InputValidator;
