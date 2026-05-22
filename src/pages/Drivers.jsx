import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Phone, 
  CheckCircle, 
  Users
} from 'lucide-react';
import { fetchDrivers, approveDriver } from '../store/slices/driverSlice';

const DriverCard = ({ driver, onApprove }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-card flex flex-col gap-6"
  >
    <div className="flex justify-between items-start">
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center font-bold text-white text-xl">
          {driver.name[0]}
        </div>
        <div>
          <h4 className="text-lg font-bold text-white">{driver.name}</h4>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <Phone size={14} />
            {driver.phone}
          </p>
        </div>
      </div>
      <div className={driver.status === 'online' ? 'status-online' : 'status-offline'}></div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30 text-center">
        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Status</p>
        <p className={`text-xs font-bold ${
          driver.isApproved ? 'text-emerald-500' : 'text-amber-500'
        }`}>
          {driver.isApproved ? 'Approved' : 'Pending'}
        </p>
      </div>
      <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30 text-center">
        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Fleet</p>
        <p className="text-xs font-bold text-white">{driver.vehicleType || 'Standard'}</p>
      </div>
    </div>

    <div className="pt-4 border-t border-slate-700/50 flex gap-2">
      {!driver.isApproved && (
        <button 
          onClick={() => onApprove(driver._id)}
          className="flex-1 btn-primary py-2 text-sm"
        >
          <CheckCircle size={16} />
          Approve
        </button>
      )}
      <button className="flex-1 btn-secondary py-2 text-sm">
        Details
      </button>
    </div>
  </motion.div>
);

const Drivers = () => {
  const dispatch = useDispatch();
  const { list: drivers, loading } = useSelector((state) => state.drivers);

  useEffect(() => {
    dispatch(fetchDrivers());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveDriver(id));
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Drivers</h2>
          <p className="text-slate-400">Manage and monitor your driver fleet.</p>
        </div>

        <div className="flex gap-3">
          <div className="relative group min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search drivers..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-white"
            />
          </div>
          <button className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <DriverCard 
              key={driver._id} 
              driver={driver} 
              onApprove={handleApprove}
            />
          ))}
          {drivers.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                <Users size={32} />
              </div>
              <h3 className="text-lg font-bold text-white">No drivers found</h3>
              <p className="text-slate-500">New driver registrations will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Drivers;
