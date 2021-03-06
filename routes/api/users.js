const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/config');
const passport = require('passport');

//load user model
const User = require('../../models/User');

//load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route Get api/users/test
// @desc  tests users route
// @access public
router.get('/test', (req, res) => {
    res.json({
        msg: 'users works'
    });
});

// @route Post api/users/rigister
// @desc  register user
// @access public
router.post('/rigister', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    //check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', //size
                    r: 'pg', //rating
                    d: 'mm' //default
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err;
                        } else {
                            newUser.password = hash;
                            newUser.save()
                                .then(user => res.json(user))
                                .catch(err => console.log(err));
                        }
                    })
                })
            }
        })
});

// @route Post api/users/login
// @desc login user/returning token
// @access public
router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    //check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const { email, password } = req.body;

    //find user by email
    User.findOne({ email })
        .then(user => {
            //check for user
            if (!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }

            //check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //user matched create jwt payload
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }

                        //sign token
                        jwt.sign(
                            payload,
                            keys.secretOrKey, { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            });
                    } else {
                        errors.password = 'Password incorrect';
                        return res.status(400).json(errors);
                    }
                });
        });
});

// @route Get api/users/current
// @desc return current user
// @access private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { id, name, email } = req.user;
    const userObj = {
        id,
        name,
        email
    };
    res.json(userObj);
});

module.exports = router;