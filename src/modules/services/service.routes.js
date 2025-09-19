const express = require('express')
const router = express.Router()
const {
    createService,
    listServices,
    showService,
    updateService,
    deleteService} = require('../services/service.controller') 

router.post('/', createService)          
router.get('/', listServices)            
router.get('/:id', showService)          
router.put('/:id', updateService)        
router.delete('/:id', deleteService)     

module.exports = router