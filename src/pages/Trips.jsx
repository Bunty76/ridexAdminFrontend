import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Plus, 
  MapPin, 
  DollarSign, 
  Loader2, 
  Search,
  ChevronRight,
  Clock,
  XCircle
} from 'lucide-react';
import { fetchTrips, createTrip } from '../store/slices/tripSlice';
import { fetchDrivers } from '../store/slices/driverSlice';

const CreateTripModal = ({ isOpen, onClose, drivers }) => {
  const [formData, setFormData] = useState({
    pickup: '',
    destination: '',
    customerName: '',
    customerPhone: '',
    driverId: '',
    fare: '',
  });
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.trips);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTrip(formData)).then((res) => {
      if (!res.error) onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl glass-panel relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Create New Trip</h3>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <XCircle size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Customer Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Pickup Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={18} />
                  <input
                    required
                    type="text"
                    placeholder="Enter pickup address"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white text-sm"
                    value={formData.pickup}
                    onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500" size={18} />
                  <input
                    required
                    type="text"
                    placeholder="Enter destination address"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white text-sm"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Assign Driver</label>
                <select
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white text-sm appearance-none"
                  value={formData.driverId}
                  onChange={(e) => setFormData({...formData, driverId: e.target.value})}
                >
                  <option value="">Select a driver</option>
                  {drivers.filter(d => d.isApproved).map(driver => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name} ({driver.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Fare ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  <input
                    required
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-white"
                    value={formData.fare}
                    onChange={(e) => setFormData({...formData, fare: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary py-3"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Trip'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const Trips = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { list: trips, loading } = useSelector((state) => state.trips);
  const { list: drivers } = useSelector((state) => state.drivers);

  useEffect(() => {
    dispatch(fetchTrips());
    dispatch(fetchDrivers());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-emerald-500 bg-emerald-500/10';
      case 'in-progress': return 'text-amber-500 bg-amber-500/10';
      case 'cancelled': return 'text-rose-500 bg-rose-500/10';
      default: return 'text-slate-400 bg-slate-800';
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Trips</h2>
          <p className="text-slate-400">View trip history and dispatch new requests.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          <Plus size={20} />
          Dispatch Trip
        </button>
      </header>

      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">All Trips</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">{trips.length}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search trips..." 
                className="pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs outline-none focus:border-primary text-white"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/20 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="px-6 py-4">Trip ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Fare</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {trips.map((trip) => (
                <tr key={trip._id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-slate-500">#{trip._id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                        {trip.customerName?.[0] || 'C'}
                      </div>
                      <span className="text-sm font-medium text-white">{trip.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span className="text-xs text-slate-300 truncate">{trip.pickup}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                        <span className="text-xs text-slate-300 truncate">{trip.destination}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{trip.driver?.name || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-sm font-bold text-white">${trip.fare || '0.00'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {trips.length === 0 && !loading && (
                <tr>
                  <td colSpan="8" className="px-6 py-20 text-center text-slate-500">
                    <Clock size={32} className="mx-auto mb-4 opacity-20" />
                    <p>No trips recorded yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateTripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        drivers={drivers}
      />
    </div>
  );
};

export default Trips;
