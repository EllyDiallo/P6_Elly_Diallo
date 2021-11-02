const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');
const sanitize= require('mongoose-sanitizer-plugin');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid Email')
            }
        }
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(sanitize);

module.exports = mongoose.model('User', userSchema);