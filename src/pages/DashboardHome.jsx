import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Users, 
  Car, 
  CheckCircle2, 
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';
import { fetchDrivers } from '../store/slices/driverSlice';
import { fetchTrips } from '../store/slices/tripSlice';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
          <TrendingUp size={12} />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
  </motion.div>
);

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { list: drivers } = useSelector((state) => state.drivers);
  const { list: trips } = useSelector((state) => state.trips);

  useEffect(() => {
    dispatch(fetchDrivers());
    dispatch(fetchTrips());
  }, [dispatch]);

  const activeDrivers = drivers.filter(d => d.status === 'online').length;
  const inProgressTrips = trips.filter(t => t.status === 'in-progress').length;
  const completedTrips = trips.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">Overview</h2>
        <p className="text-slate-400">Monitor your system performance and fleet status in real-time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Drivers" 
          value={drivers.length} 
          icon={Users} 
          color="blue" 
          trend="+4.2%"
        />
        <StatCard 
          title="Active Drivers" 
          value={activeDrivers} 
          icon={Car} 
          color="emerald" 
        />
        <StatCard 
          title="Ongoing Trips" 
          value={inProgressTrips} 
          icon={Clock} 
          color="amber" 
        />
        <StatCard 
          title="Completed Trips" 
          value={completedTrips} 
          icon={CheckCircle2} 
          color="indigo" 
          trend="+12%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trips */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Recent Trips</h3>
            <button className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {trips.slice(0, 5).map((trip) => (
              <div key={trip._id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <MapPin size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white truncate max-w-[150px]">{trip.destination}</p>
                    <p className="text-xs text-slate-500">{new Date(trip.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">${trip.fare || '0.00'}</p>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    trip.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                    trip.status === 'in-progress' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-slate-500/10 text-slate-500'
                  }`}>
                    {trip.status}
                  </span>
                </div>
              </div>
            ))}
            {trips.length === 0 && (
              <p className="text-center py-10 text-slate-500">No recent trips found</p>
            )}
          </div>
        </div>

        {/* Top Drivers */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-white mb-6">Available Drivers</h3>
          <div className="space-y-6">
            {drivers.filter(d => d.status === 'online').slice(0, 5).map((driver) => (
              <div key={driver._id} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-300">
                  {driver.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{driver.name}</p>
                  <p className="text-xs text-slate-500">{driver.phone}</p>
                </div>
                <div className="status-online"></div>
              </div>
            ))}
            {drivers.filter(d => d.status === 'online').length === 0 && (
              <p className="text-center py-10 text-slate-500">No online drivers</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
