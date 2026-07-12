import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { ChevronDown, Plus, X } from 'lucide-react';
import api from '../services/api';

const Fleet = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [regNo, setRegNo] = useState('');
  const [type, setType] = useState('Van');
  const [capacity, setCapacity] = useState('');
  const [cost, setCost] = useState('');

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/fleet');
      setVehicles(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fleet', {
        registration_number: regNo,
        type,
        max_load_capacity: Number(capacity),
        purchase_cost: Number(cost)
      });
      setShowAddModal(false);
      setRegNo('');
      setCapacity('');
      setCost('');
      fetchVehicles();
    } catch (err) {
      console.error(err);
      alert('Error adding vehicle');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'bg-neo-green';
      case 'On Trip': return 'bg-neo-blue';
      case 'In Shop': return 'bg-neo-orange';
      case 'Retired': return 'bg-neo-pink';
      default: return 'bg-white';
    }
  };

  return (
    <MainLayout>
      <div className="pb-12 text-black">
        <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mix-blend-darken">
            VEHICLE<span className="text-neo-blue">_REGISTRY</span>
          </h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center bg-neo-yellow border-4 border-black px-6 py-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all"
          >
            <Plus className="h-6 w-6 mr-2" strokeWidth={3} />
            Add_Vehicle
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <span className="font-mono text-sm font-bold bg-black text-white px-3 py-1">/// FILTERS</span>
          <div className="flex items-center bg-white border-2 border-black px-3 py-1.5 cursor-hover hover:bg-neo-yellow transition-colors shadow-[4px_4px_0_rgba(0,0,0,1)]">
            <span className="font-mono text-sm font-bold mr-2">TYPE:</span>
            <span className="font-bold uppercase">All</span>
            <ChevronDown className="h-4 w-4 ml-2" strokeWidth={3} />
          </div>
          <div className="flex items-center bg-white border-2 border-black px-3 py-1.5 cursor-hover hover:bg-neo-green transition-colors shadow-[4px_4px_0_rgba(0,0,0,1)]">
            <span className="font-mono text-sm font-bold mr-2">STATUS:</span>
            <span className="font-bold uppercase">All</span>
            <ChevronDown className="h-4 w-4 ml-2" strokeWidth={3} />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border-4 border-black shadow-hard overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black text-white font-mono text-sm uppercase">
              <tr>
                <th className="py-4 px-6">REG_NO</th>
                <th className="py-4 px-6">TYPE</th>
                <th className="py-4 px-6">CAPACITY</th>
                <th className="py-4 px-6">ACQ_COST</th>
                <th className="py-4 px-6">STATUS</th>
              </tr>
            </thead>
            <tbody className="font-bold divide-y-2 divide-black">
              {loading ? (
                <tr><td colSpan="5" className="py-8 text-center uppercase">Loading Data...</td></tr>
              ) : vehicles.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center uppercase">No Vehicles Found.</td></tr>
              ) : (
                vehicles.map(v => (
                  <tr key={v.id} className="hover:bg-gray-100 transition-colors">
                    <td className="py-5 px-6 font-mono text-lg">{v.registration_number}</td>
                    <td className="py-5 px-6 uppercase">{v.type}</td>
                    <td className="py-5 px-6 font-mono">{v.max_load_capacity} kg</td>
                    <td className="py-5 px-6 font-mono">${v.purchase_cost || '0'}</td>
                    <td className="py-5 px-6">
                      <span className={`${getStatusColor(v.status)} border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] px-3 py-1 text-xs uppercase font-black`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-black shadow-hard w-full max-w-md">
            <div className="flex justify-between items-center bg-black text-white p-4">
              <h3 className="font-bold uppercase tracking-widest">Add_New_Vehicle</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:text-neo-pink"><X strokeWidth={3} /></button>
            </div>
            <form onSubmit={handleAddVehicle} className="p-6 space-y-6">
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Registration_No</label>
                <input required value={regNo} onChange={e=>setRegNo(e.target.value)} type="text" className="w-full border-4 border-black p-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20 transition-colors" placeholder="VAN-05" />
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Vehicle_Type</label>
                <select required value={type} onChange={e=>setType(e.target.value)} className="w-full border-4 border-black p-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20 transition-colors cursor-pointer">
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                  <option value="Mini">Mini</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Max_Capacity_(KG)</label>
                <input required value={capacity} onChange={e=>setCapacity(e.target.value)} type="number" className="w-full border-4 border-black p-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20 transition-colors" placeholder="500" />
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Acq_Cost_($)</label>
                <input required value={cost} onChange={e=>setCost(e.target.value)} type="number" className="w-full border-4 border-black p-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20 transition-colors" placeholder="14000" />
              </div>
              <button type="submit" className="w-full bg-neo-green border-4 border-black p-4 font-black uppercase text-xl shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all mt-4">
                Save_Vehicle
              </button>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Fleet;
