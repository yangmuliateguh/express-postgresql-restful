const productService = require('../products/product.service')

// POST /products
async function createProduct(req, res) {
    try {
        const product = await productService.createProduct(req.body)
        res.status(201).json(product)
    }catch (err){
        console.error('Create Product Error:', err.message)
        res.status(400).json({error: err.message})
    }
}

// GET /products
async function listProducts(req, res) {
    try {
        const products = await productService.getAllProduct();
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}

// GET /products/:id
async function showProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}

// PUT /products/:id
async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body; // { name, price, stock, ... }

        const updatedProduct = await productService.updateProduct(id, updateData);

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product' });
    }
}

// DELETE /products/:id
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const deletedProduct = await productService.deleteProduct(id);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product deleted successfully',
            data: deletedProduct
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
}

module.exports = {
    createProduct,
    listProducts,
    showProduct,
    updateProduct,
    deleteProduct
}