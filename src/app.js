const express = require('express')
const authRoutes = require('./auth/auth.routes') 
const productPublic = require('./modules/products/product.public.routes')
const servicePublic = require('./modules/services/service.public.routes')

const productRoutes = require('./modules/products/product.routes') 
const serviceRoutes = require('./modules/services/service.routes')
const { authenticateToken, authorizeRole } = require('./middleware/auth.middleware')

const app = express()
app.use(express.json())

// ===== PUBLIC ACCESS ===== 
app.use('/api/auth', authRoutes)
app.use('/api/products/public', productPublic)
app.use('/api/services/public', servicePublic)

app.get('/', (req, res)=>{
    res.send('backend: expressjs database: postgresql(local)')
})

// ===== ADMIN ACCESS ===== 
app.use(authenticateToken)
app.use('/api/products', authorizeRole('admin'), productRoutes)
app.use('/api/services', authorizeRole('admin'), serviceRoutes)

module.exports = app