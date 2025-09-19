const { create, getAll, getById, update, remove} = require('../../database/queries/crud')
async function createProduct(data) {
    const payload = {
        name: data.name,
        category: data.category || 'uncategorized',
        stock: data.stock ?? 0,
        price: parseFloat(data.price)
    }

    const product = await create('products', payload)
    return product
}

async function getAllProduct(){
    return await getAll('products')
}

async function getProductById(id) {
  return await getById('products', 'id', id);
}

async function updateProduct(id, data) {
  return await update('products', 'id', id, data);
}

async function deleteProduct(id) {
    return await remove('products', 'id', id);
}


module.exports = {
    createProduct,
    getAllProduct,
    getProductById,
    updateProduct,
    deleteProduct
}