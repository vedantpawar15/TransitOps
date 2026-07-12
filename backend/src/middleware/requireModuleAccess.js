// backend/src/middleware/requireModuleAccess.js

const PERMISSIONS = {
  trip: {
    write: ['Dispatcher'],
    read: ['Dispatcher', 'SafetyOfficer']
  },
  maintenance: {
    write: ['FleetManager'],
    read: ['FleetManager', 'Dispatcher', 'FinancialAnalyst']
  },
  fuelExpense: {
    write: ['FinancialAnalyst'],
    read: ['FinancialAnalyst']
  },
  analytics: {
    write: ['FleetManager', 'FinancialAnalyst'],
    read: ['FleetManager', 'FinancialAnalyst']
  }
};

const requireModuleAccess = (moduleName, accessType) => {
  return (req, res, next) => {
    // Bypass module access check for local demo mode
    return next();
  };
};

module.exports = requireModuleAccess;
