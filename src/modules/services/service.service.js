const { create, getAll, getById, update, remove} = require('../../database/queries/crud')
async function createService(data) {
    const product = await create('services', data)
    return product
}

async function getAllService(){
    return await getAll('services')
}

async function getServiceById(id) {
  return await getById('services', 'id', id);
}

async function updateService(id, data) {
  return await update('services', 'id', id, data);
}

async function deleteService(id) {
    return await remove('services', 'id', id);
}


module.exports = {
    createService,
    getAllService,
    getServiceById,
    updateService,
    deleteService
}