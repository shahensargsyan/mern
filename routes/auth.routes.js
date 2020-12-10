const {Router} = require('express');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router()

// api/auth/register
router.post(
    '/register',
    [
        check('email','Incorrect email!').isEmail(),
        check('password','minimum 6 characters!')
        .isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400),json({
                errors: errors.array(),
                message: 'Incorect registration data'
            })
        }

        const {email, password} = req.body;

        const candidate = await User.findOne({email})

        if (candidate) {
            return res.status(400).json({message: 'user with this email exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({email, password: hashedPassword});

        await user.save();

        res.status(201).json({message: 'user has been created'});

    } catch(e) {
        res.status(500).json({message: "some server error"});
    }
});

// api/auth/login
router.post('/login', async (req, res) => {

} );

module.exports = router;0