const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../middleware/auth');
const requireModuleAccess = require('../middleware/requireModuleAccess');
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');

router.use(requireAuth);

router.get('/', requireModuleAccess('vehicle', 'read'), getVehicles);
router.get('/:id', requireModuleAccess('vehicle', 'read'), getVehicleById);
router.post('/', requireModuleAccess('vehicle', 'write'), createVehicle);
router.put('/:id', requireModuleAccess('vehicle', 'write'), updateVehicle);
router.delete('/:id', requireModuleAccess('vehicle', 'write'), deleteVehicle);

module.exports = router;
