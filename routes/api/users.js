const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//load user model
const User = require('../../models/User');

// @route get api/users/test
// @desc  tests users route
// @access public
router.get('/test', (req, res) => {
    res.json({
        msg: 'users works'
    });
});

// @route get api/users/rigister
// @desc  register user
// @access public
router.post('/rigister', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: 'Email already exists' });
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

// @route get api/users/rigister
// @desc login user/returning token
// @access public
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    //find user by email
    User.findOne({ email })
        .then(user => {
            //check for user
            if (!user) {
                return res.status(404).json({ email: 'User not found' });
            }

            //check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        res.json({ msg: 'Success' });
                    } else {
                        return res.status(400).json({ password: 'Password incorrect' });
                    }
                })
        });
});


module.exports = router;