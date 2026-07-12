// backend/src/routes/fleet.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../middleware/auth');
const requireModuleAccess = require('../middleware/requireModuleAccess');
const { getVehicles, addVehicle } = require('../controllers/fleetController');

router.use(requireAuth);

router.get('/', requireModuleAccess('trip', 'read'), getVehicles); // Use trip read access for now since there's no explicit fleet module role
router.post('/', requireModuleAccess('trip', 'write'), addVehicle);

module.exports = router;
