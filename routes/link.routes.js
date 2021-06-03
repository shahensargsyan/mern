const {Router} = require('express')
const config = require('config')
const shortid = require('shortid')
const Link = require('../models/Link')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl')
        const {from} = req.body

        const code = shortid.generate()

        const existing = await Link.findOne({from})

        if (existing) {
            return res.json({'link': existing})
        }

        const to  = baseUrl + '/t/' + code;

        const link = new Link({
            code, to, from, owner:req.user.userId
        })

        await link.save()

        res.status(201).json({link})
        
    } catch(e) {
        console.log(e)
        res.status(500).json({message: "some server error"});
    }
}) 

router.get('/', auth, auth, async (req, res) => {
    try {
        const links = await Link.find({owner: null})
        res.json(links)
    } catch(e) {
        res.status(500).json({message: "some server error"});
    }
}) 

router.get('/:id', auth, async (req, res) => {
    try {
        const links = await Link.findById({owner: req.params.id})
        res.json(links)
    } catch(e) {
        res.status(500).json({message: "some server error"});
    }
}) 

module.exports = router