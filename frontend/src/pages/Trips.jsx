import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import { Play, Check, X, Plus, AlertCircle, MapPin, Navigation } from 'lucide-react';

const Trips = () => {
  const { user, hasAccess } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Form State
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [plannedDistance, setPlannedDistance] = useState('');
  const [revenue, setRevenue] = useState('');

  // Complete Modal State
  const [completingTripId, setCompletingTripId] = useState(null);
  const [actualDistance, setActualDistance] = useState('');
  const [fuelConsumed, setFuelConsumed] = useState('');
  const [fuelCost, setFuelCost] = useState('');

  const [loading, setLoading] = useState(true);

  const canWrite = hasAccess('trip', 'write');
  const canRead = hasAccess('trip', 'read');

  const fetchTripsAndDropdowns = async () => {
    try {
      setLoading(true);
      const tripsRes = await api.get('/trips');
      setTrips(tripsRes.data);

      if (tripsRes.data.length > 0) {
        setSelectedTrip(tripsRes.data[0]);
      }

      if (canWrite) {
        const vehiclesRes = await api.get('/trips/eligible-vehicles');
        setVehicles(vehiclesRes.data);

        const driversRes = await api.get('/trips/eligible-drivers');
        setDrivers(driversRes.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchTripsAndDropdowns();
    }
  }, [canRead, canWrite]);

  const selectedVehicle = vehicles.find(v => v.id === vehicleId);
  const isOverweight = selectedVehicle && Number(cargoWeight) > Number(selectedVehicle.max_load_capacity);
  const overage = selectedVehicle && isOverweight ? Number(cargoWeight) - Number(selectedVehicle.max_load_capacity) : 0;

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (isOverweight) return;
    try {
      const body = {
        source, destination, vehicle_id: vehicleId, driver_id: driverId,
        cargo_weight: Number(cargoWeight), planned_distance: plannedDistance ? Number(plannedDistance) : null,
        revenue: revenue ? Number(revenue) : null
      };
      await api.post('/trips', body);
      setSource(''); setDestination(''); setVehicleId(''); setDriverId(''); setCargoWeight(''); setPlannedDistance(''); setRevenue('');
      fetchTripsAndDropdowns();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating trip');
    }
  };

  const handleDispatch = async (tripId) => {
    try {
      await api.patch(`/trips/${tripId}/dispatch`);
      fetchTripsAndDropdowns();
    } catch (err) {
      alert(err.response?.data?.message || 'Error dispatching trip');
    }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/trips/${completingTripId}/complete`, {
        actual_distance: Number(actualDistance), fuel_consumed: Number(fuelConsumed), fuel_cost: fuelCost ? Number(fuelCost) : undefined
      });
      setCompletingTripId(null); setActualDistance(''); setFuelConsumed(''); setFuelCost('');
      fetchTripsAndDropdowns();
    } catch (err) {
      alert(err.response?.data?.message || 'Error completing trip');
    }
  };

  const handleCancel = async (tripId) => {
    try {
      await api.patch(`/trips/${tripId}/cancel`);
      fetchTripsAndDropdowns();
    } catch (err) {
      alert(err.response?.data?.message || 'Error cancelling trip');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-300';
      case 'Dispatched': return 'bg-neo-blue';
      case 'Completed': return 'bg-neo-green';
      case 'Cancelled': return 'bg-neo-pink';
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
            TRIP<span className="text-neo-blue">_DISPATCHER</span>
          </h2>
        </div>

        {selectedTrip && (
          <div className="mb-8 bg-white border-4 border-black shadow-hard p-6">
            <h3 className="font-mono font-bold uppercase mb-4 text-sm bg-black text-white inline-block px-2 py-1">TRIP_LIFECYCLE</h3>
            <div className="flex items-center justify-between relative mt-4">
              <div className="absolute left-0 right-0 top-1/2 h-2 bg-black -translate-y-1/2 z-0" />
              {['Draft', 'Dispatched', 'Completed', 'Cancelled'].map((step, idx) => {
                const isActive = step === selectedTrip.status;
                const isPast = ['Draft', 'Dispatched', 'Completed'].indexOf(step) <= ['Draft', 'Dispatched', 'Completed', 'Cancelled'].indexOf(selectedTrip.status) && selectedTrip.status !== 'Cancelled';
                
                let stepBg = 'bg-white border-4 border-black';
                if (isActive) stepBg = getStatusColor(selectedTrip.status) + ' border-4 border-black scale-125';
                else if (isPast) stepBg = 'bg-black text-white border-4 border-black';

                return (
                  <div key={step} className="flex flex-col items-center z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${stepBg}`}>
                      {idx + 1}
                    </div>
                    <span className={`font-mono text-xs font-bold uppercase mt-2 bg-white px-1 border border-black`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Create Form */}
          <div className="lg:col-span-1 bg-white border-4 border-black shadow-hard p-6 h-fit">
            <h2 className="text-2xl font-black uppercase mb-6 tracking-tighter inline-block bg-neo-yellow px-2 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">CREATE_TRIP</h2>
            
            {canWrite ? (
              <form onSubmit={handleCreateTrip} className="space-y-4">
                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">Source</label>
                  <input required value={source} onChange={e=>setSource(e.target.value)} type="text" className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
                </div>
                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">Destination</label>
                  <input required value={destination} onChange={e=>setDestination(e.target.value)} type="text" className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
                </div>
                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">Vehicle (Available Only)</label>
                  <select required value={vehicleId} onChange={e=>setVehicleId(e.target.value)} className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20">
                    <option value="">Select...</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} - {v.max_load_capacity}kg</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">Driver (Available Only)</label>
                  <select required value={driverId} onChange={e=>setDriverId(e.target.value)} className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20">
                    <option value="">Select...</option>
                    {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">Cargo Weight (kg)</label>
                  <input required min="1" value={cargoWeight} onChange={e=>setCargoWeight(e.target.value)} type="number" className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
                </div>

                {isOverweight && (
                  <div className="bg-neo-pink border-4 border-black p-4 font-bold shadow-[4px_4px_0_rgba(0,0,0,1)]">
                    <p>Vehicle Capacity: {selectedVehicle.max_load_capacity} kg</p>
                    <p>Cargo Weight: {cargoWeight} kg</p>
                    <p className="uppercase mt-2 flex items-center bg-black text-white px-2 py-1"><X className="mr-2"/> Capacity exceeded by {overage} kg</p>
                  </div>
                )}

                <div>
                  <label className="block font-mono text-sm font-bold uppercase mb-2">Planned Dist (km)</label>
                  <input value={plannedDistance} onChange={e=>setPlannedDistance(e.target.value)} type="number" className="w-full border-4 border-black p-2.5 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
                </div>
                
                <button type="submit" disabled={isOverweight} className="w-full bg-neo-green border-4 border-black p-4 font-black uppercase text-xl shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all mt-4 disabled:opacity-50">
                  Save_Draft
                </button>
              </form>
            ) : (
              <div className="bg-gray-200 border-4 border-black p-4 font-bold text-center uppercase">READ_ONLY_ACCESS</div>
            )}
          </div>

          {/* Live Board */}
          <div className="lg:col-span-2 bg-white border-4 border-black shadow-hard p-6">
            <h2 className="text-2xl font-black uppercase mb-6 tracking-tighter inline-block bg-neo-blue px-2 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">LIVE_BOARD</h2>
            
            {loading ? (
               <div className="font-bold uppercase text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-4">
                {trips.map(trip => (
                  <div 
                    key={trip.id} 
                    onClick={() => setSelectedTrip(trip)}
                    className={`border-4 border-black p-4 cursor-pointer hover:-translate-y-1 hover:shadow-hard transition-all flex flex-col md:flex-row justify-between md:items-center ${selectedTrip?.id === trip.id ? 'bg-neo-yellow/20 shadow-hard' : 'bg-white'}`}
                  >
                    <div>
                      <div className="font-mono font-bold text-xs bg-black text-white px-1 inline-block mb-2">{trip.id.substring(0,8)}</div>
                      <p className="font-black text-lg uppercase">{trip.source} → {trip.destination}</p>
                      <span className={`${getStatusColor(trip.status)} border-2 border-black px-2 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0_rgba(0,0,0,1)] inline-block mt-2`}>{trip.status}</span>
                    </div>
                    <div className="mt-4 md:mt-0 text-left md:text-right">
                      <p className="font-bold uppercase">{trip.vehicle_name} / {trip.driver_name}</p>
                      <p className="font-mono text-sm">{trip.cargo_weight} kg</p>
                      
                      {canWrite && trip.status === 'Draft' && (
                        <div className="mt-4 flex gap-2 justify-end">
                          <button onClick={(e) => { e.stopPropagation(); handleDispatch(trip.id); }} className="bg-neo-blue border-2 border-black p-1.5 shadow-[2px_2px_0_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"><Play className="h-5 w-5"/></button>
                          <button onClick={(e) => { e.stopPropagation(); handleCancel(trip.id); }} className="bg-neo-pink border-2 border-black p-1.5 shadow-[2px_2px_0_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"><X className="h-5 w-5"/></button>
                        </div>
                      )}

                      {canWrite && trip.status === 'Dispatched' && (
                        <div className="mt-4 flex gap-2 justify-end">
                          <button onClick={(e) => { e.stopPropagation(); setCompletingTripId(trip.id); }} className="bg-neo-green border-2 border-black p-1.5 shadow-[2px_2px_0_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"><Check className="h-5 w-5"/></button>
                          <button onClick={(e) => { e.stopPropagation(); handleCancel(trip.id); }} className="bg-neo-pink border-2 border-black p-1.5 shadow-[2px_2px_0_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"><X className="h-5 w-5"/></button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {completingTripId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-black shadow-hard w-full max-w-md">
            <div className="flex justify-between items-center bg-black text-white p-4">
              <h3 className="font-bold uppercase tracking-widest">COMPLETE_TRIP</h3>
              <button onClick={() => setCompletingTripId(null)} className="hover:text-neo-pink"><X strokeWidth={3} /></button>
            </div>
            <form onSubmit={handleCompleteSubmit} className="p-6 space-y-6">
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Actual Distance (km)</label>
                <input required min="1" value={actualDistance} onChange={e=>setActualDistance(e.target.value)} type="number" className="w-full border-4 border-black p-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Fuel Consumed (L)</label>
                <input required min="1" value={fuelConsumed} onChange={e=>setFuelConsumed(e.target.value)} type="number" className="w-full border-4 border-black p-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
              </div>
              <div>
                <label className="block font-mono text-sm font-bold uppercase mb-2">Fuel Cost ($)</label>
                <input value={fuelCost} onChange={e=>setFuelCost(e.target.value)} type="number" className="w-full border-4 border-black p-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] focus:outline-none focus:bg-neo-yellow/20" />
              </div>
              <button type="submit" className="w-full bg-neo-green border-4 border-black p-4 font-black uppercase text-xl shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all mt-4">
                Confirm_Completion
              </button>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Trips;
