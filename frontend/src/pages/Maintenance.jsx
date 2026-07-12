import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import { X, Check } from 'lucide-react';

const Maintenance = () => {
  const { user, hasAccess } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // Form State
  const [vehicleId, setVehicleId] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState('');

  const [loading, setLoading] = useState(true);

  const canWrite = hasAccess('maintenance', 'write');
  const canRead = hasAccess('maintenance', 'read');

  const fetchLogsAndVehicles = async () => {
    try {
      setLoading(true);
      const logsRes = await api.get('/maintenance');
      setLogs(logsRes.data);

      if (canWrite) {
        const vehRes = await api.get('/trips/eligible-vehicles');
        setVehicles(vehRes.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchLogsAndVehicles();
    }
  }, [canRead, canWrite]);

  const handleCreateLog = async (e) => {
    e.preventDefault();
    try {
      const body = {
        vehicle_id: vehicleId,
        description,
        cost: cost ? Number(cost) : null,
        date: date || new Date().toISOString().split('T')[0]
      };
      await api.post('/maintenance', body);
      setVehicleId('');
      setDescription('');
      setCost('');
      setDate('');
      fetchLogsAndVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating maintenance log');
    }
  };

  const handleCloseLog = async (logId) => {
    try {
      await api.patch(`/maintenance/${logId}/close`);
      fetchLogsAndVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Error closing maintenance log');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-neo-orange';
      case 'Closed': return 'bg-neo-green';
      default: return 'bg-white';
    }
  };

  if (!canRead) {
    return (
      <MainLayout>
        <div className="bg-neo-pink border-4 border-black p-8 shadow-hard text-center font-black uppercase text-2xl">
          ACCESS_DENIED
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pb-12 text-black">
        <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mix-blend-darken">
            MAINTENANCE<span className="text-neo-orange">_LOG</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Side: Create Service Log Form */}
          <div className="lg:col-span-1 bg-white border-4 border-black shadow-hard p-6 h-fit">
            <h2 className="text-2xl font-black uppercase mb-6 tracking-tighter inline-block bg-neo-yellow px-2 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">LOG_SERVICE</h2>
            
            {canWrite ? (
              <form onSubmit={handleCreateLog} className="space-y-4">
                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">Vehicle (Available Only)</label>
                  <select required value={vehicleId} onChange={e=>setVehicleId(e.target.value)} className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20">
                    <option value="">Select...</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">Service Type</label>
                  <input required value={description} onChange={e=>setDescription(e.target.value)} type="text" placeholder="Oil Change" className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
                </div>
                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">Cost ($)</label>
                  <input min="0" value={cost} onChange={e=>setCost(e.target.value)} type="number" placeholder="250" className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
                </div>
                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">Date</label>
                  <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
                </div>
                <button type="submit" className="w-full bg-neo-orange border-4 border-black p-4 font-black uppercase text-xl shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all mt-4">
                  Save
                </button>
              </form>
            ) : (
              <div className="bg-gray-200 border-4 border-black p-4 font-bold text-center uppercase">READ_ONLY_ACCESS</div>
            )}

            <div className="mt-8 border-t-4 border-black pt-6">
              <div className="font-mono text-sm font-bold uppercase">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neo-green">Available</span>
                  <span>--- creating active record ---&gt;</span>
                  <span className="text-neo-orange">In Shop</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neo-orange">In Shop</span>
                  <span>--- closing record (add return) ---&gt;</span>
                  <span className="text-neo-green">Available</span>
                </div>
              </div>
              <p className="text-xs font-bold text-neo-pink mt-4">Note: In Shop vehicles are removed from the dispatch pool.</p>
            </div>
          </div>

          {/* Right Side: Service Log Table */}
          <div className="lg:col-span-2 bg-white border-4 border-black shadow-hard overflow-hidden">
             <div className="p-6 border-b-4 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tighter inline-block bg-neo-blue px-2 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">SERVICE_LOG</h2>
             </div>
             
             {loading ? (
                <div className="font-bold uppercase text-center py-8">Loading...</div>
             ) : logs.length === 0 ? (
                <div className="font-bold uppercase text-center py-8">No maintenance history recorded yet.</div>
             ) : (
               <table className="w-full text-left">
                  <thead className="bg-black text-white font-mono text-sm uppercase">
                    <tr>
                      <th className="py-4 px-6">Vehicle</th>
                      <th className="py-4 px-6">Service</th>
                      <th className="py-4 px-6">Cost</th>
                      <th className="py-4 px-6">Status</th>
                      {canWrite && <th className="py-4 px-6 text-right">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="font-bold divide-y-2 divide-black">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-100 transition-colors">
                         <td className="py-5 px-6 font-mono text-lg uppercase">{log.vehicle_name}</td>
                         <td className="py-5 px-6 uppercase">{log.description}</td>
                         <td className="py-5 px-6 font-mono">${log.cost || '0.00'}</td>
                         <td className="py-5 px-6">
                           <span className={`${getStatusColor(log.status)} border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] px-3 py-1 text-xs uppercase font-black`}>
                             {log.status === 'Open' ? 'In Shop' : 'Completed'}
                           </span>
                         </td>
                         {canWrite && (
                           <td className="py-5 px-6 text-right">
                             {log.status === 'Open' && (
                               <button onClick={() => handleCloseLog(log.id)} className="bg-neo-green border-2 border-black p-1.5 shadow-[2px_2px_0_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
                                 <Check className="h-5 w-5" />
                               </button>
                             )}
                           </td>
                         )}
                      </tr>
                    ))}
                  </tbody>
               </table>
             )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Maintenance;
