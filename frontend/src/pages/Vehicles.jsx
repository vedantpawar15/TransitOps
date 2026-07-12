import React, { useState, useEffect } from 'react';
import { Plus, Edit, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import Layout from '../components/Layout';

const statusOptions = ['All', 'Available', 'On Trip', 'In Shop', 'Retired'];

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const [formState, setFormState] = useState({
    registration_number: '',
    name: '',
    type: '',
    max_load_capacity: '',
    odometer: 0,
    acquisition_cost: '',
    status: 'Available',
    region: ''
  });

  const getVehicleTypes = () => {
    const uniqueTypes = Array.from(new Set(vehicles.map((vehicle) => vehicle.type).filter(Boolean)));
    return ['All', ...uniqueTypes];
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vehicles');
      setVehicles(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Unable to load vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const resetForm = () => {
    setEditingVehicleId(null);
    setFormState({
      registration_number: '',
      name: '',
      type: '',
      max_load_capacity: '',
      odometer: 0,
      acquisition_cost: '',
      status: 'Available',
      region: ''
    });
    setError('');
    setSuccess('');
  };

  const handleInputChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = (vehicle) => {
    setEditingVehicleId(vehicle.id);
    setFormState({
      registration_number: vehicle.registration_number || '',
      name: vehicle.name || '',
      type: vehicle.type || '',
      max_load_capacity: vehicle.max_load_capacity ?? '',
      odometer: vehicle.odometer ?? 0,
      acquisition_cost: vehicle.acquisition_cost ?? '',
      status: vehicle.status || 'Available',
      region: vehicle.region || ''
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      registration_number: formState.registration_number.trim(),
      name: formState.name.trim(),
      type: formState.type.trim(),
      max_load_capacity: Number(formState.max_load_capacity),
      odometer: Number(formState.odometer),
      acquisition_cost: formState.acquisition_cost === '' ? null : Number(formState.acquisition_cost),
      status: formState.status,
      region: formState.region.trim() || null
    };

    if (!payload.registration_number || !payload.name || !payload.type || !payload.max_load_capacity) {
      return setError('Registration number, name, type, and max load capacity are required.');
    }

    try {
      if (editingVehicleId) {
        await api.put(`/vehicles/${editingVehicleId}`, payload);
        setSuccess('Vehicle updated successfully');
      } else {
        await api.post('/vehicles', payload);
        setSuccess('Vehicle added successfully');
      }
      resetForm();
      setShowForm(false);
      fetchVehicles();
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      if (apiMessage) {
        setError(apiMessage);
      } else {
        setError('Unable to save vehicle. Please try again.');
      }
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const statusMatch = statusFilter === 'All' || vehicle.status === statusFilter;
    const typeMatch = typeFilter === 'All' || vehicle.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const getStatusBadge = (status) => {
    const classes = {
      Available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'On Trip': 'bg-sky-100 text-sky-800 border-sky-200',
      'In Shop': 'bg-orange-100 text-orange-800 border-orange-200',
      Retired: 'bg-slate-100 text-slate-600 border-slate-200'
    };
    return (
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold border ${classes[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Vehicle Registry</h1>
          <p className="text-slate-500 mt-1">View, add, and update vehicles for dispatch and maintenance.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm((prev) => !prev);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
        >
          <Plus className="h-4 w-4" />
          {showForm ? 'Close Form' : 'Add Vehicle'}
        </button>
      </div>

      {(error || success) && (
        <div className={`mb-6 rounded-2xl border px-4 py-4 ${error ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
          <div className="flex items-start gap-3">
            {error ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
            <p className="text-sm font-medium">{error || success}</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{editingVehicleId ? 'Edit Vehicle' : 'New Vehicle'}</h2>
              <p className="text-sm text-slate-500">Provide the details for this fleet asset.</p>
            </div>
            {editingVehicleId && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Registration Number
              <input
                value={formState.registration_number}
                onChange={(e) => handleInputChange('registration_number', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Name
              <input
                value={formState.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Type
              <input
                value={formState.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="e.g. Van, Truck"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Status
              <select
                value={formState.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                {statusOptions.filter((option) => option !== 'All').map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Max Load Capacity
              <input
                type="number"
                min="0"
                step="any"
                value={formState.max_load_capacity}
                onChange={(e) => handleInputChange('max_load_capacity', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Odometer
              <input
                type="number"
                min="0"
                value={formState.odometer}
                onChange={(e) => handleInputChange('odometer', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Acquisition Cost
              <input
                type="number"
                min="0"
                step="any"
                value={formState.acquisition_cost}
                onChange={(e) => handleInputChange('acquisition_cost', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 col-span-full">
              Region
              <input
                value={formState.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>

            <div className="col-span-full flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
              >
                {editingVehicleId ? 'Update Vehicle' : 'Create Vehicle'}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Status Filter
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Type Filter
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                {getVehicleTypes().map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase tracking-wide">Registration</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wide">Type</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wide">Capacity</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wide">Odometer</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wide">Region</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-sm text-slate-500">Loading vehicles...</td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-sm text-slate-500">No vehicles match the current filters.</td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-slate-700 font-medium">{vehicle.registration_number}</td>
                    <td className="px-4 py-4 text-slate-700">{vehicle.name}</td>
                    <td className="px-4 py-4 text-slate-700">{vehicle.type}</td>
                    <td className="px-4 py-4 text-slate-700">{vehicle.max_load_capacity}</td>
                    <td className="px-4 py-4 text-slate-700">{vehicle.odometer ?? 0}</td>
                    <td className="px-4 py-4">{getStatusBadge(vehicle.status)}</td>
                    <td className="px-4 py-4 text-slate-700">{vehicle.region || '—'}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(vehicle)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Vehicles;
