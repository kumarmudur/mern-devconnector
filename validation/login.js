const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateLoginInput = data => {
    let errors = {};

    let { email, password } = data;
    email = !isEmpty(email) ? email : '';
    password = !isEmpty(password) ? password : '';

    if (!validator.isEmail(email)) {
        errors.email = 'Email is invalid';
    }

    if (validator.isEmpty(email)) {
        errors.email = 'Email is required';
    }

    if (validator.isEmpty(password)) {
        errors.password = 'Password is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}