const express = require('express')
const authController = require('../auth/auth.controller')
const { authenticateToken } = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/users', authController.listUsers)

router.get('/profile', authenticateToken, (req, res) => {
    res.json({ user: req.user })
})

module.exports = router