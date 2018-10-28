const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateRegisterInput = data => {
    let errors = {};
    let { name, email, password, passwordConfirm } = data;

    name = !isEmpty(name) ? name : '';
    email = !isEmpty(email) ? email : '';
    password = !isEmpty(password) ? password : '';
    passwordConfirm = !isEmpty(passwordConfirm) ? passwordConfirm : '';

    if (!validator.isLength(name, { min: 2, max: 30 })) {
        errors.name = 'Name must be between 2 and 30 characters';
    }

    if (validator.isEmpty(name)) {
        errors.name = 'Name is required';
    }

    if (!validator.isEmail(email)) {
        errors.email = 'Email is invalid';
    }

    if (validator.isEmpty(email)) {
        errors.email = 'Email is required';
    }

    if (!validator.isLength(password, { min: 6, max: 30 })) {
        errors.password = 'Password must be at least 6 characters';
    }

    if (validator.isEmpty(password)) {
        errors.password = 'Password is required';
    }

    if (!validator.equals(password, passwordConfirm)) {
        errors.passwordConfirm = 'Passwords must match';
    }

    if (validator.isEmpty(passwordConfirm)) {
        errors.passwordConfirm = 'Confirm password is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}