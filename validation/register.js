const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateRegisterInput = data => {
    let errors = {};
    const { name } = data;
    if (!validator.isLength(name, { min: 2, max: 30 })) {
        errors.name = 'Name must be between 2 and 30 characters';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}