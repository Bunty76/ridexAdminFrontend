import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Phone, 
  CheckCircle, 
  Users,
  Mail,
  Star,
  Car,
  MapPin,
  FileText,
  X
} from 'lucide-react';
import { fetchDrivers, approveDriver } from '../store/slices/driverSlice';

const DriverDetailsModal = ({ isOpen, onClose, driver, onApprove }) => {
  if (!isOpen || !driver) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass-panel relative overflow-hidden text-white"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Driver Profile & Fleet Specs</h3>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Personal details & rating */}
            <div className="space-y-6">
              <div className="flex gap-4 items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center font-bold text-white text-2xl">
                  {driver.name[0]}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{driver.name}</h4>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    driver.isApproved ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {driver.isApproved ? 'Approved & Verified' : 'Approval Pending'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Contact Details</h5>
                <div className="p-4 bg-slate-900/30 rounded-xl space-y-3 border border-slate-800">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <Phone className="text-primary" size={16} />
                    <span>{driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <Mail className="text-primary" size={16} />
                    <span className="truncate">{driver.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Operational Metrics</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${driver.status === 'online' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-slate-500'}`}></div>
                      <span className="text-sm font-bold capitalize text-white">{driver.status}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-500 mb-1">Rating</p>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="text-amber-500 fill-amber-500" size={16} />
                      <span className="text-sm font-bold text-white">{driver.rating?.toFixed(1) || '5.0'}</span>
                      <span className="text-[10px] text-slate-500">({driver.totalRatings || 0})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Vehicle & location & documents */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Vehicle Specifications</h5>
                <div className="p-5 bg-slate-900/30 rounded-xl space-y-4 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg text-primary">
                      <Car size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Model & Classification</p>
                      <p className="text-sm font-bold text-white capitalize">{driver.vehicle?.model || 'Standard'} ({driver.vehicleType})</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                    <div>
                      <p className="text-[10px] text-slate-500">Plate Number</p>
                      <p className="text-xs font-mono font-bold text-slate-300 uppercase mt-0.5">{driver.vehicle?.plateNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Color</p>
                      <p className="text-xs font-bold text-slate-300 capitalize mt-0.5">{driver.vehicle?.color || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {driver.location && (
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Live Coordinates</h5>
                  <div className="p-4 bg-slate-900/30 rounded-xl flex items-center gap-3 border border-slate-800 text-sm text-slate-300">
                    <MapPin className="text-rose-500" size={18} />
                    <div className="font-mono text-xs text-slate-300">
                      Lat: {driver.location.latitude?.toFixed(6)}, Lng: {driver.location.longitude?.toFixed(6)}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Driver Documents</h5>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2.5 bg-slate-900/30 hover:bg-slate-800/30 border border-slate-800 rounded-lg flex items-center gap-2 cursor-pointer transition-colors text-slate-400 hover:text-white">
                    <FileText size={14} className="text-primary" />
                    <span>Driving License</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/30 hover:bg-slate-800/30 border border-slate-800 rounded-lg flex items-center gap-2 cursor-pointer transition-colors text-slate-400 hover:text-white">
                    <FileText size={14} className="text-primary" />
                    <span>Vehicle RC</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/30 hover:bg-slate-800/30 border border-slate-800 rounded-lg flex items-center gap-2 cursor-pointer transition-colors text-slate-400 hover:text-white">
                    <FileText size={14} className="text-primary" />
                    <span>Insurance</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/30 hover:bg-slate-800/30 border border-slate-800 rounded-lg flex items-center gap-2 cursor-pointer transition-colors text-slate-400 hover:text-white">
                    <FileText size={14} className="text-primary" />
                    <span>Aadhaar Card</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <button onClick={onClose} className="flex-1 btn-secondary py-3 text-sm">
              Close Profile
            </button>
            {!driver.isApproved && (
              <button 
                onClick={() => {
                  onApprove(driver._id);
                  onClose();
                }}
                className="flex-1 btn-primary py-3 text-sm"
              >
                <CheckCircle size={18} />
                Approve Driver
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DriverCard = ({ driver, onApprove, onDetails }) => (
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
      <button 
        onClick={onDetails}
        className="flex-1 btn-secondary py-2 text-sm"
      >
        Details
      </button>
    </div>
  </motion.div>
);

const Drivers = () => {
  const dispatch = useDispatch();
  const { list: drivers, loading } = useSelector((state) => state.drivers);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
              onDetails={() => {
                setSelectedDriver(driver);
                setIsDetailsOpen(true);
              }}
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

      <DriverDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedDriver(null);
        }}
        driver={selectedDriver}
        onApprove={handleApprove}
      />
    </div>
  );
};

export default Drivers;
