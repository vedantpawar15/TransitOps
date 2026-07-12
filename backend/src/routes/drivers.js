// backend/src/routes/drivers.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../middleware/auth');
const requireModuleAccess = require('../middleware/requireModuleAccess');
const { getDrivers, addDriver } = require('../controllers/driverController');

router.use(requireAuth);

router.get('/', requireModuleAccess('trip', 'read'), getDrivers);
router.post('/', requireModuleAccess('trip', 'write'), addDriver);

module.exports = router;
