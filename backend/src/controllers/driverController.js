// backend/src/controllers/driverController.js
const pool = require('../config/db');

// GET /drivers
const getDrivers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM drivers ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ message: 'Error fetching drivers' });
  }
};

// POST /drivers
const addDriver = async (req, res) => {
  const { name, license_number, license_category, license_expiry, contact_number } = req.body;
  if (!name || !license_number || !license_category || !license_expiry || !contact_number) {
    return res.status(400).json({ message: 'Missing required driver fields' });
  }
  
  try {
    const { rows } = await pool.query(
      `INSERT INTO drivers (name, license_number, license_category, license_expiry, contact_number, status) 
       VALUES ($1, $2, $3, $4, $5, 'Available') RETURNING *`,
      [name, license_number, license_category, license_expiry, contact_number]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error adding driver:', error);
    res.status(500).json({ message: 'Error adding driver' });
  }
};

module.exports = { getDrivers, addDriver };
