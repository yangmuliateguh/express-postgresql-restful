const express = require('express')
const productRoutes = require('./modules/products/product.routes') 
const serviceRoutes = require('./modules/services/service.routes') 
const authRoutes = require('./auth/auth.routes') 

const app = express()
app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/auth', authRoutes)

app.get('/', (req, res)=>{
    res.send('backend: expressjs database: postgresql(local)');
})

module.exports = app