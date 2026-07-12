import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Shield, Wrench, CheckCircle, Info } from 'lucide-react';

const Settings = () => {
  const { user } = useContext(AuthContext);

  // General Settings State
  const [depotName, setDepotName] = useState('Gandhinagar Depot GJ14');
  const [currency, setCurrency] = useState('INR (Rs)');
  const [distanceUnit, setDistanceUnit] = useState('Kilometers');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const savedDepot = localStorage.getItem('setting_depot');
    const savedCurrency = localStorage.getItem('setting_currency');
    const savedUnit = localStorage.getItem('setting_unit');

    if (savedDepot) setDepotName(savedDepot);
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedUnit) setDistanceUnit(savedUnit);
  }, []);

  const handleSaveChanges = (e) => {
    e.preventDefault();
    localStorage.setItem('setting_depot', depotName);
    localStorage.setItem('setting_currency', currency);
    localStorage.setItem('setting_unit', distanceUnit);
    
    setSuccessMsg('Settings saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const check = <span className="text-emerald-500 font-bold text-lg">✓</span>;
  const dash = <span className="text-zinc-650">—</span>;
  const view = <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">view</span>;

  const rbacRows = [
    { role: 'Fleet Manager', fleet: check, drivers: check, trips: dash, fuel: dash, analytics: check },
    { role: 'Dispatcher', fleet: view, drivers: dash, trips: check, fuel: dash, analytics: dash },
    { role: 'Safety Officer', fleet: dash, drivers: check, trips: view, fuel: dash, analytics: dash },
    { role: 'Financial Analyst', fleet: view, drivers: dash, trips: dash, fuel: check, analytics: check }
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings & RBAC</h1>
        <p className="text-zinc-400 mt-1">Configure general depot parameters and review application RBAC permissions matrix.</p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: General Settings Form */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm border-b border-zinc-800 pb-3">
            General
          </h2>

          <form onSubmit={handleSaveChanges} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Depot Name</label>
              <input
                type="text"
                value={depotName}
                onChange={e => setDepotName(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Currency</label>
              <input
                type="text"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Distance Unit</label>
              <input
                type="text"
                value={distanceUnit}
                onChange={e => setDistanceUnit(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-white transition-all"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-900 bg-sky-400 hover:bg-sky-500 transition-all font-semibold cursor-pointer shadow-md shadow-sky-400/10"
            >
              Save changes
            </button>
          </form>
        </div>

        {/* Right Side: RBAC Table */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm border-b border-zinc-800 pb-3 flex items-center">
            <Shield className="h-4 w-4 mr-2 text-amber-500" />
            Role-Based Access (RBAC)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 px-4 text-center">Fleet</th>
                  <th className="pb-3 px-4 text-center">Drivers</th>
                  <th className="pb-3 px-4 text-center">Trips</th>
                  <th className="pb-3 px-4 text-center">Fuel/Exp.</th>
                  <th className="pb-3 pl-4 text-center">Analytics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {rbacRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-950/20 transition-all">
                    <td className="py-4 pr-4 font-semibold text-white">{row.role}</td>
                    <td className="py-4 px-4 text-center">{row.fleet}</td>
                    <td className="py-4 px-4 text-center">{row.drivers}</td>
                    <td className="py-4 px-4 text-center">{row.trips}</td>
                    <td className="py-4 px-4 text-center">{row.fuel}</td>
                    <td className="py-4 pl-4 text-center">{row.analytics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 flex items-start text-zinc-400 text-xs leading-relaxed">
            <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5 text-zinc-500" />
            <span>
              The RBAC permission matrix defines security boundaries for writes and reads. Users with **Full Access (✓)** can register/edit records, **View** permits read-only dashboards, and **—** denies module entry completely.
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
