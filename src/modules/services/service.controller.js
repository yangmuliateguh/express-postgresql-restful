// controllers/service.controller.js
const serviceService = require('../services/service.service'); // Sesuaikan path

// POST /services
async function createService(req, res) {
    try {
        const service = await serviceService.createService(req.body);
        res.status(201).json(service);
    } catch (err) {
        console.error('Create Service Error:', err.message);
        res.status(400).json({ error: err.message });
    }
}

// GET /services
async function listServices(req, res) {
    try {
        const services = await serviceService.getAllService();
        res.status(200).json(services);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
}

// GET /services/:id
async function showService(req, res) {
    try {
        const { id } = req.params;
        const service = await serviceService.getServiceById(id);

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.status(200).json(service);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch service' });
    }
}

// PUT /services/:id
async function updateService(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedService = await serviceService.updateService(id, updateData);

        if (!updatedService) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.status(200).json({
            message: 'Service updated successfully',
            data: updatedService
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update service' });
    }
}

// DELETE /services/:id
async function deleteService(req, res) {
    try {
        const { id } = req.params;
        const deletedService = await serviceService.deleteService(id);

        if (!deletedService) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.status(200).json({
            message: 'Service deleted successfully',
            data: deletedService
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete service' });
    }
}

module.exports = {
    createService,
    listServices,
    showService,
    updateService,
    deleteService
};