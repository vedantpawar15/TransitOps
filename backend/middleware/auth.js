const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Bypass JWT verification for local demo mode
  req.user = { id: 'demo-user', role: 'FleetManager', name: 'Raman K.' };
  next();
};

module.exports = { requireAuth };
