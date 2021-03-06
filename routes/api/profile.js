const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load profile and user model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//load input validation
const validateProfileInput = require('../../validation/profile');

// @route Get api/users/test
// @desc  tests profile route
// @access Public
router.get('/test', (req, res) => {
    res.json({
        msg: 'profile works'
    })
});

// @route Get api/profile
// @desc  Get current or edit user profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noProfile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile)
        })
        .catch(err => {
            res.status(404).json(err);
        });
});

// @route Post api/profile
// @desc  Create user profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    //check validation
    if (!isValid) {
        //return any errors with 400 status
        return res.status(400).json(errors);
    }

    //get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    const {
        handle,
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        social,
        date,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram
    } = req.body;

    if (handle) profileFields.handle = handle;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;

    //skills - split into array
    if (typeof skills !== undefined) {
        profileFields.skills = skills.split(',');
    }

    //social
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                //update
                Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
                    .then(profile => res.json(profile));
            } else {
                //create

                //check if handle exists
                Profile.findOne({ handle: profileFields.handle }).then(profile => {
                    if (profile) {
                        errors.handle = 'This handle already exists';
                        res.status(400).json(errors);
                    }
                })

                //save profile
                new Profile(profileFields).save().then(profile => res.json(profile));
            }
        });
});


module.exports = router;