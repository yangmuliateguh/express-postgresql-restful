const express = require('express')
const router = express.Router()
const {
    createProduct,
    listProducts,
    showProduct,
    updateProduct,
    deleteProduct
} = require('../products/product.controller') 

router.post('/', createProduct)          
router.get('/', listProducts)            
router.get('/:id', showProduct)          
router.put('/:id', updateProduct)        
router.delete('/:id', deleteProduct)     

module.exports = router