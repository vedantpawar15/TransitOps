import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Plus, X } from 'lucide-react';
import api from '../services/api';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [name, setName] = useState('');
  const [license, setLicense] = useState('');
  const [category, setCategory] = useState('LVM');
  const [expiry, setExpiry] = useState('');
  const [contact, setContact] = useState('');

  const fetchDrivers = async () => {
    try {
      const res = await api.get('/drivers');
      setDrivers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      await api.post('/drivers', {
        name,
        license_number: license,
        license_category: category,
        license_expiry: expiry,
        contact_number: contact
      });
      setShowAddModal(false);
      setName('');
      setLicense('');
      setExpiry('');
      setContact('');
      fetchDrivers();
    } catch (err) {
      console.error(err);
      alert('Error adding driver');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'bg-neo-green';
      case 'On Trip': return 'bg-neo-blue';
      case 'Off Duty': return 'bg-gray-300';
      case 'Suspended': return 'bg-neo-orange';
      default: return 'bg-white';
    }
  };

  return (
    <MainLayout>
      <div className="pb-12 text-black">
        <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mix-blend-darken">
            DRIVER<span className="text-neo-pink">_PROFILES</span>
          </h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center bg-neo-yellow border-4 border-black px-6 py-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all"
          >
            <Plus className="h-6 w-6 mr-2" strokeWidth={3} />
            Add_Driver
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-sm font-bold bg-black text-white px-3 py-1">/// TOGGLE_STAT</span>
          <div className="flex gap-2">
            <span className="bg-neo-green border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] px-3 py-1 text-xs uppercase font-black cursor-pointer hover:translate-y-[2px] hover:shadow-none transition-all">Available</span>
            <span className="bg-neo-blue border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] px-3 py-1 text-xs uppercase font-black cursor-pointer hover:translate-y-[2px] hover:shadow-none transition-all">On_Trip</span>
            <span className="bg-gray-300 border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] px-3 py-1 text-xs uppercase font-black cursor-pointer hover:translate-y-[2px] hover:shadow-none transition-all">Off_Duty</span>
            <span className="bg-neo-orange border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] px-3 py-1 text-xs uppercase font-black cursor-pointer hover:translate-y-[2px] hover:shadow-none transition-all">Suspended</span>
          </div>
          <p className="text-sm font-bold text-neo-orange ml-4 hidden md:block">Rule: Expired license or Suspended status = Blocked from trip assignment.</p>
        </div>

        {/* Table */}
        <div className="bg-white border-4 border-black shadow-hard overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black text-white font-mono text-sm uppercase">
              <tr>
                <th className="py-4 px-6">DRIVER</th>
                <th className="py-4 px-6">LICENSE_NO</th>
                <th className="py-4 px-6">CATEGORY</th>
                <th className="py-4 px-6">EXPIRY</th>
                <th className="py-4 px-6">CONTACT</th>
                <th className="py-4 px-6">STATUS</th>
              </tr>
            </thead>
            <tbody className="font-bold divide-y-2 divide-black">
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center uppercase">Loading Data...</td></tr>
              ) : drivers.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center uppercase">No Drivers Found.</td></tr>
              ) : (
                drivers.map(d => (
                  <tr key={d.id} className="hover:bg-gray-100 transition-colors">
                    <td className="py-5 px-6 font-mono text-lg">{d.name}</td>
                    <td className="py-5 px-6 uppercase">{d.license_number}</td>
                    <td className="py-5 px-6 uppercase">{d.license_category}</td>
                    <td className="py-5 px-6 font-mono">{new Date(d.license_expiry).toLocaleDateString()}</td>
                    <td className="py-5 px-6 font-mono">{d.contact_number}</td>
                    <td className="py-5 px-6">
                      <span className={`${getStatusColor(d.status)} border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] px-3 py-1 text-xs uppercase font-black`}>
                        {d.status}
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
              <h3 className="font-bold uppercase tracking-widest">Add_New_Driver</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:text-neo-pink"><X strokeWidth={3} /></button>
            </div>
            <form onSubmit={handleAddDriver} className="p-6 space-y-6">
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Full_Name</label>
                <input required value={name} onChange={e=>setName(e.target.value)} type="text" className="w-full border-4 border-black p-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20 transition-colors" placeholder="Alex" />
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">License_No</label>
                <input required value={license} onChange={e=>setLicense(e.target.value)} type="text" className="w-full border-4 border-black p-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20 transition-colors" placeholder="DL-88213" />
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Category</label>
                <select required value={category} onChange={e=>setCategory(e.target.value)} className="w-full border-4 border-black p-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20 transition-colors cursor-pointer">
                  <option value="LVM">LVM</option>
                  <option value="HVM">HVM</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Expiry_Date</label>
                <input required value={expiry} onChange={e=>setExpiry(e.target.value)} type="date" className="w-full border-4 border-black p-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20 transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Contact</label>
                <input required value={contact} onChange={e=>setContact(e.target.value)} type="text" className="w-full border-4 border-black p-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20 transition-colors" placeholder="9876543210" />
              </div>
              <button type="submit" className="w-full bg-neo-green border-4 border-black p-4 font-black uppercase text-xl shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all mt-4">
                Save_Driver
              </button>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Drivers;
