const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router()

router.post(
    '/test',
    async (req, res, User) => {
        res.status(201).json({message: 'user has been created'});
    });
// api/auth/register
router.post(
    '/register',
    [
        check('email','Incorrect email!').isEmail(),
        check('password','minimum 6 characters!').isLength({min: 6})
    ],
    async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
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

        res.status(201).json({message: "User created"});

    } catch(e) {
        res.status(500).json({message: e.message+"some server error"});
    }
});

// api/auth/login
router.post(
    '/login', 
    [
        check('email','Please input correct email!').normalizeEmail().isEmail(),
        check('password','input password!').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400),json({
                errors: errors.array(),
                message: 'Incorect login data'
            })
        }

        const {email, password} = req.body;

        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).jon({message: 'user not found!'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({message: 'incorrect password!'})
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        );
        
        res.json({token, userId:user.id});
        
    } catch(e) {
        res.status(500).json({message: "some server error"});
    }
});

module.exports = router;