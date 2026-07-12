import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import { Fuel, DollarSign, X } from 'lucide-react';

const FuelExpenses = () => {
  const { user, hasAccess } = useContext(AuthContext);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);

  // Log Fuel Form
  const [fuelVehicleId, setFuelVehicleId] = useState('');
  const [fuelLiters, setFuelLiters] = useState('');
  const [fuelCost, setFuelCost] = useState('');
  const [fuelDate, setFuelDate] = useState('');

  // Add Expense Form
  const [expVehicleId, setExpVehicleId] = useState('');
  const [expTripId, setExpTripId] = useState('');
  const [expToll, setExpToll] = useState('');
  const [expOther, setExpOther] = useState('');
  const [expDate, setExpDate] = useState('');

  const [showFuelForm, setShowFuelForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const [loading, setLoading] = useState(true);

  const canWrite = hasAccess('fuelExpense', 'write');
  const canRead = hasAccess('fuelExpense', 'read');

  const fetchData = async () => {
    try {
      setLoading(true);
      const fuelRes = await api.get('/fuel-logs');
      setFuelLogs(fuelRes.data);

      const expRes = await api.get('/expenses');
      setExpenses(expRes.data);

      if (canWrite) {
        const vehRes = await api.get('/trips/eligible-vehicles');
        setVehicles(vehRes.data);

        const tripsRes = await api.get('/trips');
        setTrips(tripsRes.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchData();
    }
  }, [canRead, canWrite]);

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fuel-logs', {
        vehicle_id: fuelVehicleId,
        liters: Number(fuelLiters),
        cost: Number(fuelCost),
        date: fuelDate || undefined
      });
      setFuelVehicleId('');
      setFuelLiters('');
      setFuelCost('');
      setFuelDate('');
      setShowFuelForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding fuel log');
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', {
        vehicle_id: expVehicleId,
        trip_id: expTripId || undefined,
        toll: Number(expToll || 0),
        other: Number(expOther || 0),
        date: expDate || undefined
      });
      setExpVehicleId('');
      setExpTripId('');
      setExpToll('');
      setExpOther('');
      setExpDate('');
      setShowExpenseForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding expense');
    }
  };

  const totalFuelCost = fuelLogs.reduce((sum, item) => sum + Number(item.cost || 0), 0);
  const totalMaintCost = expenses.reduce((sum, item) => sum + Number(item.maintenance_cost || 0), 0);
  const totalOperationalCost = totalFuelCost + totalMaintCost;

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b-4 border-black pb-4 gap-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mix-blend-darken">
            OPERATIONAL<span className="text-neo-green">_EXPENSES</span>
          </h2>
          {canWrite && (
            <div className="flex gap-4">
              <button 
                onClick={() => { setShowFuelForm(true); setShowExpenseForm(false); }}
                className="flex items-center bg-neo-green border-4 border-black px-4 py-2 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
              >
                <Fuel className="h-5 w-5 mr-2" strokeWidth={3} /> Log_Fuel
              </button>
              <button 
                onClick={() => { setShowExpenseForm(true); setShowFuelForm(false); }}
                className="flex items-center bg-neo-yellow border-4 border-black px-4 py-2 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
              >
                <DollarSign className="h-5 w-5 mr-2" strokeWidth={3} /> Log_Expense
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Fuel Logs */}
          <div className="bg-white border-4 border-black shadow-hard overflow-hidden">
            <div className="p-4 border-b-4 border-black bg-neo-green">
               <h2 className="text-xl font-black uppercase tracking-tighter flex items-center">
                 <Fuel className="mr-2" strokeWidth={3} /> FUEL_LOGS
               </h2>
            </div>
            {loading ? (
              <div className="font-bold uppercase text-center py-8">Loading...</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-black text-white font-mono text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Liters</th>
                    <th className="py-3 px-4 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="font-bold divide-y-2 divide-black">
                  {fuelLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-100 transition-colors">
                      <td className="py-3 px-4 uppercase">{log.vehicle_name}</td>
                      <td className="py-3 px-4 font-mono">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-mono">{log.liters} L</td>
                      <td className="py-3 px-4 font-mono text-right">${Number(log.cost).toFixed(2)}</td>
                    </tr>
                  ))}
                  {fuelLogs.length === 0 && <tr><td colSpan="4" className="text-center py-4 uppercase">No logs</td></tr>}
                </tbody>
              </table>
            )}
          </div>

          {/* Other Expenses */}
          <div className="bg-white border-4 border-black shadow-hard overflow-hidden">
            <div className="p-4 border-b-4 border-black bg-neo-yellow">
               <h2 className="text-xl font-black uppercase tracking-tighter flex items-center">
                 <DollarSign className="mr-2" strokeWidth={3} /> OTHER_EXPENSES
               </h2>
            </div>
            {loading ? (
              <div className="font-bold uppercase text-center py-8">Loading...</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-black text-white font-mono text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Route/Vehicle</th>
                    <th className="py-3 px-4">Toll</th>
                    <th className="py-3 px-4">Other</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="font-bold divide-y-2 divide-black">
                  {expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-gray-100 transition-colors">
                      <td className="py-3 px-4 uppercase text-sm">
                        {exp.source && exp.destination ? `${exp.source} → ${exp.destination}` : 'General Overhead'}
                        <div className="font-mono text-xs text-gray-600">{exp.vehicle_name}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">${exp.toll.toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono">${exp.other.toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono text-right">${exp.total.toFixed(2)}</td>
                    </tr>
                  ))}
                  {expenses.length === 0 && <tr><td colSpan="4" className="text-center py-4 uppercase">No expenses</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Cost Summary Footer */}
        <div className="bg-black text-white border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,1)] p-8 flex flex-col md:flex-row justify-between items-center transform hover:-rotate-1 transition-all">
           <div>
             <h3 className="font-black text-2xl uppercase tracking-widest text-neo-yellow">Total_Operational_Cost</h3>
             <p className="font-mono text-sm uppercase mt-2">Sum of Fuel & Maintenance</p>
           </div>
           <div className="text-4xl md:text-6xl font-black mt-4 md:mt-0 text-neo-green">
             ${totalOperationalCost.toFixed(2)}
           </div>
        </div>
      </div>

      {/* Fuel Form Modal */}
      {showFuelForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-black shadow-hard w-full max-w-md">
            <div className="flex justify-between items-center bg-black text-white p-4">
              <h3 className="font-bold uppercase tracking-widest">LOG_FUEL</h3>
              <button onClick={() => setShowFuelForm(false)} className="hover:text-neo-pink"><X strokeWidth={3} /></button>
            </div>
            <form onSubmit={handleFuelSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Vehicle</label>
                <select required value={fuelVehicleId} onChange={e=>setFuelVehicleId(e.target.value)} className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20">
                  <option value="">Select...</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Liters</label>
                <input required min="0.1" step="any" value={fuelLiters} onChange={e=>setFuelLiters(e.target.value)} type="number" className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Total Cost ($)</label>
                <input required min="0.1" step="any" value={fuelCost} onChange={e=>setFuelCost(e.target.value)} type="number" className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Date</label>
                <input type="date" value={fuelDate} onChange={e=>setFuelDate(e.target.value)} className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
              </div>
              <button type="submit" className="w-full bg-neo-green border-4 border-black p-4 font-black uppercase text-xl shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all mt-6">
                Submit_Fuel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-black shadow-hard w-full max-w-md">
            <div className="flex justify-between items-center bg-black text-white p-4">
              <h3 className="font-bold uppercase tracking-widest">LOG_EXPENSE</h3>
              <button onClick={() => setShowExpenseForm(false)} className="hover:text-neo-pink"><X strokeWidth={3} /></button>
            </div>
            <form onSubmit={handleExpenseSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Vehicle</label>
                <select required value={expVehicleId} onChange={e=>setExpVehicleId(e.target.value)} className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20">
                  <option value="">Select...</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Linked Trip</label>
                <select value={expTripId} onChange={e=>setExpTripId(e.target.value)} className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20">
                  <option value="">None</option>
                  {trips.map(t => <option key={t.id} value={t.id}>{t.source} → {t.destination}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Toll Cost ($)</label>
                <input min="0" step="any" value={expToll} onChange={e=>setExpToll(e.target.value)} type="number" className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Other Cost ($)</label>
                <input min="0" step="any" value={expOther} onChange={e=>setExpOther(e.target.value)} type="number" className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Date</label>
                <input type="date" value={expDate} onChange={e=>setExpDate(e.target.value)} className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
              </div>
              <button type="submit" className="w-full bg-neo-yellow border-4 border-black p-4 font-black uppercase text-xl shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all mt-6">
                Submit_Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default FuelExpenses;
