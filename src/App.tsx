import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, Users, Target, GraduationCap, TrendingUp,
  AlertCircle, CheckCircle2, Navigation, Bell, Search,
  ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, LogIn, Eye, EyeOff,
  Activity, BarChart3, Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';

const COLORS = ['#9d26ff', '#00d2ff', '#ff00c8', '#f59e0b'];

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext: string;
  trend?: number;
  icon: React.ElementType;
  color: string;
}

const MetricCard = ({ title, value, subtext, trend, icon: Icon, color }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg" style={{ background: `${color}22` }}>
        <Icon size={24} color={color} />
      </div>
      {trend !== undefined && (
        <span className={`flex items-center text-xs font-bold ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">{title}</p>
    <h3 className="text-3xl font-bold mt-1 text-white">{value}</h3>
    <p className="text-zinc-500 text-xs mt-2">{subtext}</p>
  </motion.div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // S&OP data states
  const [perf, setPerf] = useState<any>(null);
  const [opsPerformance, setOpsPerformance] = useState<any[]>([]);
  const [psrData, setPsrData] = useState<any[]>([]);
  const [attrStatus, setAttrStatus] = useState<any[]>([]);
  const [planActions, setPlanActions] = useState<any[]>([]);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const [
        { data: perfData },
        { data: opsData },
        { data: psrsData },
        { data: statusData },
        { data: actionsData }
      ] = await Promise.all([
        supabase.from('regional_performance').select('*').single(),
        supabase.from('operators_performance').select('*'),
        supabase.from('psr_performance').select('*'),
        supabase.from('attribution_status').select('*'),
        supabase.from('action_plan').select('*')
      ]);

      if (perfData) setPerf(perfData);
      if (opsData) setOpsPerformance(opsData);
      if (psrsData) setPsrData(psrsData);
      if (statusData) setAttrStatus(statusData);
      if (actionsData) setPlanActions(actionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });

    if (error) {
      setLoginError(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const filteredPSRs = psrData.filter(psr =>
    psr.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black relative overflow-hidden font-main">
        <div className="login-background" />

        {/* Dynamic Premium Orbs */}
        <motion.div
          animate={{
            x: [0, 120, -60, 0],
            y: [0, 80, 150, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="orb w-[600px] h-[600px] bg-purple-600/20 -top-[20%] -left-[10%]"
        />
        <motion.div
          animate={{
            x: [0, -100, 80, 0],
            y: [0, 150, -50, 0],
            scale: [1, 0.8, 1.1, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="orb w-[500px] h-[500px] bg-blue-500/15 bottom-[-15%] right-[-5%]"
        />
        <motion.div
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -100, 40, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="orb w-[300px] h-[300px] bg-pink-500/10 top-[40%] right-[15%]"
        />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-card w-full max-w-[440px] p-12 relative z-10 border-white/10"
        >
          <div className="flex flex-col items-center mb-12">
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center mb-8 shadow-[0_20px_40px_rgba(157,38,255,0.3)] relative group"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Target size={44} className="text-white relative z-10" />
            </motion.div>

            <h1 className="text-5xl font-extrabold gradient-text mb-3 tracking-tight">S&OP V.tal</h1>
            <p className="text-zinc-400 text-sm font-semibold tracking-[0.15em] uppercase opacity-70">Executive Management Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Client Identification</label>
                <Users size={14} className="text-zinc-700" />
              </div>
              <div className="premium-input-container">
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="premium-input"
                  placeholder="user@vtal.com.br"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Secure Gateway</label>
                <ShieldCheck size={14} className="text-zinc-700" />
              </div>
              <div className="relative premium-input-container">
                <input
                  type={showPass ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="premium-input"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-all p-1.5 rounded-lg hover:bg-white/5"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center gap-3 text-rose-400 text-xs font-bold shadow-[0_10px_20px_rgba(244,63,94,0.05)]"
              >
                <AlertCircle size={18} />
                {loginError}
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              type="submit"
              className="premium-btn w-full text-sm py-5"
            >
              <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
              INITIALIZE CONNECTION
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center pt-8 border-t border-white/10"
          >
            <p className="text-[10px] text-zinc-600 font-black tracking-[0.3em] uppercase mb-2">Protocol Layer Secured</p>
            <div className="flex justify-center items-center gap-3">
              <span className="text-[9px] text-zinc-700 font-bold px-2 py-1 bg-white/5 rounded border border-white/5">V.3.1.2-ALPHA</span>
              <span className="w-1 h-1 bg-zinc-800 rounded-full" />
              <span className="text-[9px] text-zinc-700 font-bold px-2 py-1 bg-white/5 rounded border border-white/5">AES-256 ENCRYPTION</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="bg-mesh" />

      {/* Dynamic Orbs for Dashboard */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="orb w-[600px] h-[600px] bg-purple-900/10 top-[10%] left-[-20%]"
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 100, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="orb w-[400px] h-[400px] bg-blue-900/10 bottom-[10%] right-[-10%]"
      />

      <nav className="sidebar">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20 cursor-pointer hover:rotate-12 transition-transform">
          <Target size={26} />
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            title="Dashboard Geral"
          >
            <LayoutDashboard size={24} />
          </button>
          <button
            onClick={() => setActiveTab('ops')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'ops' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            title="Análise Operacional"
          >
            <Users size={24} />
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'training' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            title="Capacitação"
          >
            <GraduationCap size={24} />
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'actions' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            title="Plano de Ações"
          >
            <TrendingUp size={24} />
          </button>
        </div>

        <div className="mt-auto mb-8">
          <button
            onClick={handleLogout}
            className="p-3 text-zinc-500 hover:text-rose-400 transition-colors"
          >
            <LogIn size={20} className="rotate-180" />
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="dashboard-container">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-5xl font-extrabold gradient-text tracking-tight">S&OP Manager</h1>
              <p className="text-zinc-500 text-sm mt-2 flex items-center gap-2 font-medium">
                <Navigation size={14} className="text-purple-400" />
                Regional Sudeste / Rio de Janeiro <span className="text-zinc-800">•</span> Julho 2025
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="glass-card py-2.5 px-6 flex items-center gap-3 border-white/5">
                <Clock size={16} className="text-purple-400" />
                <span className="text-xs font-bold tracking-wider uppercase text-zinc-400">Sync: 11:24 PROD</span>
              </div>
              <button className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all group relative">
                <Bell size={20} className="group-hover:text-purple-400" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50 animate-ping"></span>
                <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Metrics Grid */}
                <div className="metric-grid">
                  <MetricCard
                    title="Meta D0"
                    value={perf?.meta_d0 || 0}
                    subtext="Instalações planejadas"
                    icon={Target}
                    color="#9d26ff"
                  />
                  <MetricCard
                    title="Realizado OK"
                    value={perf?.realizado || 0}
                    subtext={`${perf ? ((perf.realizado / perf.meta_d0) * 100).toFixed(1) : 0}% da meta`}
                    icon={CheckCircle2}
                    color="#10b981"
                    trend={-39}
                  />
                  <MetricCard
                    title="Projeção"
                    value={perf?.projecao || 0}
                    subtext="Estimativa de fechamento"
                    icon={TrendingUp}
                    color="#00d2ff"
                  />
                  <MetricCard
                    title="Ociosidade"
                    value="79.8%"
                    subtext="Técnicos sem produção"
                    icon={AlertCircle}
                    color="#ef4444"
                  />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass-card">
                    <h4 className="section-title">Performance por Operadora</h4>
                    <div className="h-[350px] mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={opsPerformance}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2e" vertical={false} />
                          <XAxis dataKey="name" stroke="#71717a" axisLine={false} tickLine={false} fontSize={11} />
                          <YAxis stroke="#71717a" axisLine={false} tickLine={false} fontSize={11} />
                          <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                            contentStyle={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Bar dataKey="meta" name="Meta" fill="#1e1e24" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="ok" name="Realizado" fill="url(#colorOk)" radius={[6, 6, 0, 0]} />
                          <defs>
                            <linearGradient id="colorOk" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#9d26ff" stopOpacity={0.9} />
                              <stop offset="95%" stopColor="#9d26ff" stopOpacity={0.3} />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-card">
                    <h4 className="section-title">Status de Atribuição</h4>
                    <div className="h-[300px] relative mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={attrStatus}
                            innerRadius={75}
                            outerRadius={95}
                            paddingAngle={10}
                            dataKey="count"
                            nameKey="status"
                            stroke="none"
                          >
                            {attrStatus.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em]">Total</p>
                        <p className="text-3xl font-extrabold text-white">171</p>
                      </div>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-3">
                      {attrStatus.map((s, i) => (
                        <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                            <span className="text-zinc-500 text-[10px] font-extrabold uppercase tracking-widest">{s.status}</span>
                          </div>
                          <span className="text-lg font-bold">{s.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PSR Performance with Filters */}
                <div className="glass-card">
                  <div className="flex justify-between items-center mb-10">
                    <h4 className="section-title !mb-0">
                      <Users size={20} className="text-purple-400" />
                      Performance por Prestador (PSR)
                    </h4>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                      <input
                        type="text"
                        placeholder="Pesquisa inteligente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs font-bold focus:outline-none focus:border-purple-500/50 transition-all min-w-[300px]"
                      />
                    </div>
                  </div>
                  <div className="table-container">
                    <div className="overflow-x-auto scroll-hide">
                      <table>
                        <thead>
                          <tr>
                            <th>Identificação PSR</th>
                            <th>Total Força</th>
                            <th>Ociosidade Crit.</th>
                            <th>Pipeline Oport.</th>
                            <th>Comprometimento</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPSRs.map((psr, i) => (
                            <tr key={i}>
                              <td className="font-bold flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-xs font-black text-purple-400">
                                  {psr.name.substring(0, 2).toUpperCase()}
                                </div>
                                <span>{psr.name}</span>
                              </td>
                              <td className="font-semibold text-zinc-300">{psr.total}</td>
                              <td>
                                <div className="flex items-center gap-2">
                                  <span className="text-rose-400 font-bold">{psr.sem_producao}</span>
                                  <span className="text-zinc-600 text-[10px] font-bold">({((psr.sem_producao / psr.total) * 100).toFixed(0)}%)</span>
                                </div>
                              </td>
                              <td className="text-emerald-400 font-bold">{psr.oportunidades}</td>
                              <td>
                                <div className="flex items-center gap-4">
                                  <div className="flex-1 bg-zinc-900 h-2 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${((psr.total - psr.sem_producao) / psr.total) * 100}%` }}
                                      className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
                                    />
                                  </div>
                                  <span className="text-xs font-black text-zinc-400">
                                    {(((psr.total - psr.sem_producao) / psr.total) * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ops' && (
              <motion.div
                key="ops"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-8"
              >
                <div className="glass-card !p-0">
                  <div className="p-10 border-b border-white/5 flex justify-between items-center">
                    <div>
                      <h4 className="section-title !mb-1 text-2xl">
                        <Activity size={24} className="text-blue-400" />
                        Visão Detalhada da Operação
                      </h4>
                      <p className="text-zinc-500 text-sm font-medium">Análise volumétrica da regional por especialidade técnica</p>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-400 tracking-widest">LIVE STATUS</div>
                  </div>

                  <div className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                      {[
                        { label: "Total Técnicos", val: "1.421", color: "white", icon: Users },
                        { label: "Sem Instalação OK", val: "702", color: "rose-500", icon: AlertCircle },
                        { label: "Oportunidades Pipeline", val: "1.836", color: "purple-400", icon: TrendingUp },
                        { label: "Eficácia Geral", val: "64%", color: "blue-400", icon: Target }
                      ].map((m, i) => (
                        <div key={i} className="p-7 rounded-2xl bg-white/[0.02] border border-white/5 border-b-2 border-b-white/10">
                          <div className="flex justify-between items-start mb-4">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{m.label}</p>
                            <m.icon size={18} className="text-zinc-600" />
                          </div>
                          <p className={`text-4xl font-black text-${m.color}`}>{m.val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <h5 className="text-xs font-black text-zinc-500 flex items-center gap-2 uppercase tracking-widest">
                          <BarChart3 size={14} className="text-purple-400" /> Concentração por Setor
                        </h5>
                        <div className="space-y-4">
                          {[
                            { s: 'RJ.BGU.BGU.FTTH', t: 26, sp: 19 },
                            { s: 'RJ.DQX.DQX.FTTH', t: 23, sp: 15 },
                            { s: 'RS.PA2.IPN.11', t: 20, sp: 16 },
                            { s: 'RJ.BTJ.ALV.FTTH', t: 18, sp: 16 }
                          ].map((item, i) => (
                            <div key={i} className="p-5 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center font-black text-xs text-zinc-500">0{i + 1}</div>
                                <div>
                                  <p className="font-bold text-sm tracking-tight">{item.s}</p>
                                  <p className="text-[10px] text-zinc-600 font-bold uppercase">{item.t} técnicos</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-rose-400 font-black text-sm">{item.sp} Ociosos</p>
                                <div className="w-32 h-1.5 bg-black rounded-full mt-1.5 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(item.sp / item.t) * 100}%` }}
                                    className="h-full bg-rose-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h5 className="text-xs font-black text-zinc-500 flex items-center gap-2 uppercase tracking-widest">
                          <Layout size={14} className="text-blue-400" /> Histograma de Especialidades
                        </h5>
                        <div className="h-[350px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={opsPerformance} layout="vertical">
                              <XAxis type="number" hide />
                              <YAxis dataKey="label" type="category" stroke="#52525b" fontSize={10} width={80} axisLine={false} tickLine={false} fontWeight={700} />
                              <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                contentStyle={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                              />
                              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                                {opsPerformance.map((_, index) => (
                                  <Cell key={index} fill={index % 2 === 0 ? 'var(--vtal-purple)' : 'var(--vtal-blue)'} fillOpacity={0.8} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'actions' && (
              <motion.div
                key="actions"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h4 className="text-3xl font-black gradient-text">Roadmap Estratégico</h4>
                    <p className="text-zinc-500 text-sm mt-2 font-medium">Priorização de ações imediatas para reversão de indicadores críticos</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-black text-rose-500 tracking-widest uppercase">Crítico</span>
                    <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white tracking-widest uppercase">Q3 2025</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {planActions.map((rec, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -10 }}
                      className="glass-card !p-8 border-l-4 border-l-purple-500 relative group overflow-hidden"
                    >
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/5 blur-[40px] group-hover:bg-purple-500/10 transition-colors" />
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-purple-400 font-extrabold text-[10px] uppercase tracking-[0.2em]">{rec.dia}</span>
                        <div className={`tag ${rec.impacto === 'Crítica' ? 'tag-danger' : 'tag-success'}`}>
                          {rec.impacto}
                        </div>
                      </div>
                      <p className="text-lg font-bold leading-tight mb-8 text-zinc-100">{rec.acao}</p>
                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(j => <div key={j} className="w-7 h-7 rounded-full border border-black bg-zinc-800 flex items-center justify-center text-[10px] font-black">U{j}</div>)}
                        </div>
                        <button className="text-[10px] font-black text-purple-400 hover:text-white transition-colors flex items-center gap-1 leading-none">
                          DETALHES <ArrowUpRight size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  <div className="glass-card border-dashed border-zinc-800 bg-transparent flex flex-col items-center justify-center text-center p-12 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                      <ShieldCheck size={32} className="text-zinc-600" />
                    </div>
                    <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em]">Planejamento Tático</p>
                    <p className="text-[10px] text-zinc-700 font-bold mt-2 leading-relaxed">Clique para configurar novas diretrizes e alertas</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'training' && (
              <motion.div
                key="training"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card !p-0"
              >
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.01] to-transparent">
                  <div>
                    <h4 className="section-title !mb-1 text-2xl">Matriz de Capacitação Técnica</h4>
                    <p className="text-zinc-500 text-sm font-medium">Acompanhamento de gap de habilidades e produtividade especializada</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block mb-1">Status Geral</span>
                      <span className="text-3xl font-black text-emerald-400">75%</span>
                    </div>
                    <div className="w-32 h-2.5 bg-black rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>

                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    {[
                      { title: "Fundamentos & Normas", desc: "Fibra Óptica, Técnicas de Fusão e Certificação.", h: "32h", status: "tag-success", perc: "94%" },
                      { title: "Experiência do Cliente", desc: "Comunicação, Empatia e Pós-atendimento.", h: "16h", status: "tag-warning", perc: "82%" }
                    ].map((m, i) => (
                      <motion.div key={i} whileHover={{ x: 8 }} className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-purple-600/10 flex items-center justify-center group-hover:bg-purple-600/20 transition-all text-purple-400">
                            {i % 2 === 0 ? <GraduationCap size={28} /> : <Users size={28} />}
                          </div>
                          <span className={`tag ${m.status}`}>Módulo Concluído</span>
                        </div>
                        <h5 className="text-xl font-black mb-2 tracking-tight">{m.title}</h5>
                        <p className="text-sm text-zinc-500 mb-6 font-medium">{m.desc}</p>
                        <div className="flex items-center gap-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          <span>{m.h} Dedicação</span>
                          <span className="text-zinc-800">•</span>
                          <span className="text-emerald-400">{m.perc} Performance</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-8">
                    <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-400">
                          <TrendingUp size={28} />
                        </div>
                        <span className="tag tag-success">Módulo Concluído</span>
                      </div>
                      <h5 className="text-xl font-black mb-2 tracking-tight">Análise de Dados (KPIs)</h5>
                      <p className="text-sm text-zinc-500 mb-6 font-medium">Metodologias TMA, NPS e RCA aplicada à operação de campo.</p>
                      <div className="flex items-center gap-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        <span>24h Dedicação</span>
                        <span className="text-zinc-800">•</span>
                        <span className="text-emerald-400">88% Performance</span>
                      </div>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/[0.01] border border-dashed border-white/10 opacity-40">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-700">
                          <ShieldCheck size={28} />
                        </div>
                        <span className="tag bg-zinc-900 text-zinc-600">Bloqueado</span>
                      </div>
                      <h5 className="text-xl font-black mb-2 tracking-tight text-zinc-600">Simulações Práticas</h5>
                      <p className="text-sm text-zinc-700 font-medium tracking-tight">Cenários avançados de diagnóstico e novas tecnologias FTTH.</p>
                      <p className="mt-6 text-[10px] font-black text-purple-900 uppercase tracking-widest">Liberação em: Agosto 2025</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;
