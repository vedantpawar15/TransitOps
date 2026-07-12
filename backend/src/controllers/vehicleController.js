const pool = require('../config/db');

const VALID_STATUSES = ['Available', 'On Trip', 'In Shop', 'Retired'];

const getAvailableVehiclesForDispatch = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM vehicles WHERE status NOT IN ('Retired', 'In Shop') ORDER BY created_at DESC"
  );
  return rows;
};

const getVehicles = async (req, res) => {
  const { status, type, region } = req.query;
  const conditions = [];
  const params = [];

  if (status) {
    conditions.push(`status = $${params.length + 1}`);
    params.push(status);
  }
  if (type) {
    conditions.push(`type = $${params.length + 1}`);
    params.push(type);
  }
  if (region) {
    conditions.push(`region = $${params.length + 1}`);
    params.push(region);
  }

  let queryText = 'SELECT * FROM vehicles';
  if (conditions.length > 0) {
    queryText += ` WHERE ${conditions.join(' AND ')}`;
  }
  queryText += ' ORDER BY created_at DESC';

  try {
    const { rows } = await pool.query(queryText, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
};

const getVehicleById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ message: 'Error fetching vehicle' });
  }
};

const createVehicle = async (req, res) => {
  const {
    registration_number,
    name,
    type,
    max_load_capacity,
    odometer = 0,
    acquisition_cost = null,
    status = 'Available',
    region = null
  } = req.body;

  if (!registration_number || !name || !type || max_load_capacity === undefined) {
    return res.status(400).json({ message: 'registration_number, name, type, and max_load_capacity are required' });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO vehicles
       (registration_number, name, type, max_load_capacity, odometer, acquisition_cost, status, region)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [registration_number, name, type, max_load_capacity, odometer, acquisition_cost, status, region]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    if (error.code === '23505' || error.constraint === 'vehicles_registration_number_key') {
      return res.status(400).json({ message: 'A vehicle with this registration number already exists' });
    }
    res.status(500).json({ message: 'Error creating vehicle' });
  }
};

const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const {
    registration_number,
    name,
    type,
    max_load_capacity,
    odometer,
    acquisition_cost,
    status,
    region
  } = req.body;

  const fields = [];
  const params = [];

  if (registration_number !== undefined) {
    fields.push(`registration_number = $${params.length + 1}`);
    params.push(registration_number);
  }
  if (name !== undefined) {
    fields.push(`name = $${params.length + 1}`);
    params.push(name);
  }
  if (type !== undefined) {
    fields.push(`type = $${params.length + 1}`);
    params.push(type);
  }
  if (max_load_capacity !== undefined) {
    fields.push(`max_load_capacity = $${params.length + 1}`);
    params.push(max_load_capacity);
  }
  if (odometer !== undefined) {
    fields.push(`odometer = $${params.length + 1}`);
    params.push(odometer);
  }
  if (acquisition_cost !== undefined) {
    fields.push(`acquisition_cost = $${params.length + 1}`);
    params.push(acquisition_cost);
  }
  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }
    fields.push(`status = $${params.length + 1}`);
    params.push(status);
  }
  if (region !== undefined) {
    fields.push(`region = $${params.length + 1}`);
    params.push(region);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: 'No fields provided for update' });
  }

  params.push(id);
  const queryText = `UPDATE vehicles SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING *`;

  try {
    const { rows } = await pool.query(queryText, params);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    if (error.code === '23505' || error.constraint === 'vehicles_registration_number_key') {
      return res.status(400).json({ message: 'A vehicle with this registration number already exists' });
    }
    res.status(500).json({ message: 'Error updating vehicle' });
  }
};

const deleteVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      "UPDATE vehicles SET status = 'Retired' WHERE id = $1 RETURNING *",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error retiring vehicle:', error);
    res.status(500).json({ message: 'Error retiring vehicle' });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAvailableVehiclesForDispatch
};
