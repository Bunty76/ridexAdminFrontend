import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CreditCard, 
  TrendingUp, 
  Download, 
  CheckCircle2, 
  Clock, 
  Filter
} from 'lucide-react';
import { fetchTrips } from '../store/slices/tripSlice';

const PaymentStat = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="glass-card">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500`}>
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase">Monthly</span>
    </div>
    <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
    <div className="mt-2 flex items-center gap-1">
      <TrendingUp size={12} className="text-emerald-500" />
      <span className="text-[10px] text-emerald-500 font-bold">{subtext}</span>
    </div>
  </div>
);

const Payments = () => {
  const dispatch = useDispatch();
  const { list: trips } = useSelector((state) => state.trips);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const completedTrips = trips.filter(t => t.status === 'completed');
  const totalRevenue = completedTrips.reduce((acc, curr) => acc + (parseFloat(curr.fare) || 0), 0);
  const pendingPayments = trips.filter(t => t.status === 'in-progress').length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Payments</h2>
          <p className="text-slate-400">Track revenue, driver payouts, and transaction history.</p>
        </div>

        <button className="btn-secondary">
          <Download size={18} />
          Export Report
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PaymentStat 
          title="Total Revenue" 
          value={`$${totalRevenue.toFixed(2)}`} 
          subtext="+12.5% vs last month"
          icon={CreditCard}
          color="blue"
        />
        <PaymentStat 
          title="Avg. Trip Value" 
          value={`$${(totalRevenue / (completedTrips.length || 1)).toFixed(2)}`} 
          subtext="+5.2% vs last month"
          icon={TrendingUp}
          color="emerald"
        />
        <PaymentStat 
          title="Pending Payments" 
          value={pendingPayments} 
          subtext="3 required attention"
          icon={Clock}
          color="amber"
        />
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
          <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
          <button className="text-slate-400 hover:text-white flex items-center gap-2 text-xs font-medium">
            <Filter size={14} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/20 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {completedTrips.map((trip) => (
                <tr key={trip._id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">TXN-{trip._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-white">{trip.customerName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-white">${trip.fare}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400 flex items-center gap-2">
                      <CreditCard size={14} />
                      Cash / Digital
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase">
                      <CheckCircle2 size={12} />
                      Paid
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {completedTrips.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-slate-500">
                    No payment history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
