const express = require('express')
const router = express.Router()
const { listProducts } = require('../products/product.controller') 

router.get('/', listProducts)           
module.exports = router 