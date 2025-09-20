const express = require('express')
const router = express.Router()
const { listServices } = require('../services/service.controller') 

router.get('/', listServices)      

module.exports = router