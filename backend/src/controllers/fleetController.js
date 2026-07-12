// backend/src/controllers/fleetController.js
const pool = require('../config/db');

// GET /fleet
const getVehicles = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
};

// POST /fleet
const addVehicle = async (req, res) => {
  const { registration_number, type, max_load_capacity, purchase_cost } = req.body;
  if (!registration_number || !type || max_load_capacity === undefined) {
    return res.status(400).json({ message: 'Missing required vehicle fields' });
  }
  
  try {
    const { rows } = await pool.query(
      `INSERT INTO vehicles (registration_number, type, max_load_capacity, purchase_cost, status) 
       VALUES ($1, $2, $3, $4, 'Available') RETURNING *`,
      [registration_number, type, max_load_capacity, purchase_cost]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ message: 'Error adding vehicle' });
  }
};

module.exports = { getVehicles, addVehicle };
