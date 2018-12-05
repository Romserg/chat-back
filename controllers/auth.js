const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const User = require('../models/userModels');
const Helpers = require('../Helpers/helper');
const bcrypt = require('bcryptjs');

module.exports = {
    async CreateUser(req, res) {
        const schema = Joi.object().keys({
            username: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string().email({ minDomainAtoms: 2 }).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/).required()
        });

        const { error, value } = Joi.validate(req.body, schema);
        
        console.log(value);
        if (error && error.details) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.details });
        };

        const userEmail = await User.findOne({ email: Helpers.lowerCase(req.body.email) });
        if (userEmail) {
            return res.status(HttpStatus.CONFLICT).json({ message: 'Email already exist' });
        };

        const userName = await User.findOne({ username: Helpers.firstLetterUpper(req.body.username) });
        if (userName) {
            return res.status(HttpStatus.CONFLICT).json({ message: 'Username already exist' });
        };

        return bcrypt.hash(value.password, 10, (err, hash) => {
            if (err) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Error hashing password' });
            }
            const body = {
                username: Helpers.firstLetterUpper(value.username),
                email: Helpers.lowerCase(value.email),
                passoword: hash
            };
            User.create(body)
                .then(user => {
                    res.status(HttpStatus.CREATED).json({message: 'User created successfully', user});
                })
                .catch(err => {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
                })
        });
    }
}
