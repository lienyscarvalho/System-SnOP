import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, Users, Target, GraduationCap, TrendingUp,
  AlertCircle, CheckCircle2, Navigation, Bell, Search,
  ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, Lock, LogIn, Eye, EyeOff
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-black relative overflow-hidden">
        {/* Animated Background Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card w-full max-w-md p-10 border-white/5 bg-white/5 relative z-10"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
              <Lock size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">S&OP V.tal</h1>
            <p className="text-zinc-400 text-sm">Entre com suas credenciais para acessar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 block">E-mail Corporativo</label>
              <div className="relative">
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium"
                  placeholder="usuario@vtal.com.br"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Sessão Segura</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-400 text-sm">
                <AlertCircle size={18} />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl py-4 font-bold tracking-wide hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-purple-600/20"
            >
              <LogIn size={20} />
              ACESSAR DASHBOARD
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-xs text-zinc-600">Sistema Seguro de Gestão de S&OP • V.1.0.0</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20 cursor-pointer hover:scale-105 transition-transform">
          <Target size={28} />
        </div>
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

        <div className="mt-auto mb-8">
          <button
            onClick={handleLogout}
            className="p-3 text-zinc-500 hover:text-rose-400 transition-colors"
          >
            <LogIn size={20} className="rotate-180" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard-container">
          {/* Header */}
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold gradient-text">S&OP Management System</h1>
              <p className="text-zinc-500 text-sm mt-1 flex items-center gap-2">
                <Navigation size={14} className="text-purple-400" />
                Regional Sudeste • Rio de Janeiro • Julho 2025
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="glass-card py-2 px-4 flex items-center gap-2 border-white/5">
                <Clock size={16} className="text-purple-400" />
                <span className="text-sm font-medium">Snapshot: 23/07/2025 17:00</span>
              </div>
              <button className="p-3 bg-white/5 rounded-full border border-white/5 hover:border-purple-500/50 transition-all group overflow-hidden relative">
                <Bell size={20} className="group-hover:animate-bounce" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                  <div className="lg:col-span-2 glass-card border-white/5 overflow-hidden">
                    <h4 className="section-title">Performance por Operadora</h4>
                    <div className="h-[300px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={opsPerformance}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2e" vertical={false} />
                          <XAxis dataKey="name" stroke="#71717a" axisLine={false} tickLine={false} />
                          <YAxis stroke="#71717a" axisLine={false} tickLine={false} />
                          <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                            contentStyle={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Bar dataKey="meta" name="Meta" fill="#2a2a2e" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="ok" name="Realizado" fill="url(#colorOk)" radius={[4, 4, 0, 0]} />
                          <defs>
                            <linearGradient id="colorOk" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#9d26ff" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#9d26ff" stopOpacity={0.2} />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-card border-white/5">
                    <h4 className="section-title">Distribuição de Status</h4>
                    <div className="h-[300px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={attrStatus}
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={8}
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
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Total</p>
                        <p className="text-2xl font-bold">171</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {attrStatus.map((s, i) => (
                        <div key={i} className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                            <span className="text-zinc-500 text-[10px] font-bold uppercase">{s.status}</span>
                          </div>
                          <span className="text-sm font-bold">{s.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PSR Performance with Filters */}
                <div className="glass-card border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="section-title !mb-0">Análise por PSR (Prestador)</h4>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                      <input
                        type="text"
                        placeholder="Buscar PSR..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto scroll-hide">
                    <table>
                      <thead>
                        <tr>
                          <th>PSR</th>
                          <th>Total Técnicos</th>
                          <th>Ociosidade (Sem Prod)</th>
                          <th>Oportunidades</th>
                          <th>Eficiência de Alocação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPSRs.map((psr, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors border-b border-white/5">
                            <td className="font-bold flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs">
                                {psr.name.substring(0, 2)}
                              </div>
                              {psr.name}
                            </td>
                            <td>{psr.total}</td>
                            <td>
                              <div className="flex items-center gap-2">
                                <span className="text-rose-400 font-bold">{psr.sem_producao}</span>
                                <span className="text-zinc-600 text-xs">({((psr.sem_producao / psr.total) * 100).toFixed(0)}%)</span>
                              </div>
                            </td>
                            <td className="text-emerald-400 font-medium">{psr.oportunidades}</td>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="flex-1 bg-zinc-900 h-2 rounded-full overflow-hidden border border-white/5">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((psr.total - psr.sem_producao) / psr.total) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
                                  />
                                </div>
                                <span className="text-xs font-bold text-zinc-400 w-8">
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
              </motion.div>
            )}

            {activeTab === 'ops' && (
              <motion.div
                key="ops"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card border-white/5 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Users size={120} />
                  </div>
                  <h4 className="section-title">Visão Detalhada da Operação</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Total Técnicos</p>
                      <p className="text-2xl font-bold">1.421</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Sem Instalação OK</p>
                      <p className="text-2xl font-bold text-rose-500">702</p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-600/10 border border-purple-500/20">
                      <p className="text-purple-400 text-xs font-bold uppercase mb-1">Oportunidades Pipeline</p>
                      <p className="text-2xl font-bold">1.836</p>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20">
                      <p className="text-blue-400 text-xs font-bold uppercase mb-1">Média de Eficácia</p>
                      <p className="text-2xl font-bold">64%</p>
                    </div>
                  </div>

                  <h5 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-widest">Concentração por Setor (Top 5)</h5>
                  <div className="space-y-4">
                    {[
                      { s: 'RJ.BGU.BGU.FTTH', t: 26, sp: 19 },
                      { s: 'RJ.DQX.DQX.FTTH', t: 23, sp: 15 },
                      { s: 'RS.PA2.IPN.11', t: 20, sp: 16 },
                      { s: 'RJ.BTJ.ALV.FTTH', t: 18, sp: 16 },
                      { s: 'RJ.BRB.BRB.FTTH', t: 18, sp: 16 }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center font-bold text-zinc-500">0{i + 1}</div>
                          <div>
                            <p className="font-bold text-sm tracking-wide">{item.s}</p>
                            <p className="text-xs text-zinc-500">{item.t} técnicos total</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-rose-400 font-bold text-sm">{item.sp} Ociosos</p>
                          <div className="w-32 h-1.5 bg-zinc-900 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-rose-500" style={{ width: `${(item.sp / item.t) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'actions' && (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h4 className="section-title !mb-0">Plano de Ação Estratégico</h4>
                    <p className="text-zinc-500 text-xs mt-1">Recomendações baseadas no diagnóstico de 11/02/2026</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="tag tag-danger">Alta Prioridade</span>
                    <span className="tag bg-white/10 text-white border border-white/10">Snapshot Jul/25</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {planActions.map((rec, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="glass-card border-white/5 border-l-4 border-l-purple-500 bg-gradient-to-br from-white/5 to-transparent"
                    >
                      <div className="flex justify-between mb-4">
                        <span className="text-purple-400 font-bold text-sm uppercase tracking-tighter">{rec.dia}</span>
                        <span className={`tag ${rec.impacto === 'Crítica' ? 'tag-danger' : 'tag-success'}`}>
                          {rec.impacto}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed font-medium mb-4">{rec.acao}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(j => <div key={j} className="w-6 h-6 rounded-full border border-black bg-zinc-800 flex items-center justify-center text-[8px] font-bold">U{j}</div>)}
                        </div>
                        <button className="text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                          VER DETALHES <ArrowUpRight size={10} />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {/* Placeholder for Strategic Long Term */}
                  <div className="glass-card border-white/5 border-dashed bg-transparent flex flex-col items-center justify-center text-center p-8">
                    <ShieldCheck size={32} className="text-zinc-700 mb-2" />
                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Ações Táticas (30-90 dias)</p>
                    <p className="text-[10px] text-zinc-700 mt-1">Clique para visualizar roadmap expandido</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'training' && (
              <motion.div
                key="training"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card border-white/5"
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h4 className="section-title !mb-0">Matriz de Capacitação Técnica</h4>
                    <p className="text-zinc-500 text-xs mt-1">Progresso por núcleo de conhecimento</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-400">STATUS GERAL</span>
                    <div className="w-24 h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: '75%' }} />
                    </div>
                    <span className="text-xs font-bold text-emerald-400">75%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/20 transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center group-hover:bg-purple-600/20 transition-colors">
                          <GraduationCap size={24} className="text-purple-400" />
                        </div>
                        <span className="tag tag-success">CONCLUÍDO</span>
                      </div>
                      <h5 className="font-bold text-lg mb-2 tracking-tight">Módulo 1: Fundamentos & Normas</h5>
                      <p className="text-sm text-zinc-500 mb-4 font-medium leading-relaxed">Instalação de Fibra Óptica, Técnicas de Fusão e Certificação de Links.</p>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <span>32 Horas</span>
                        <span>•</span>
                        <span>94% Aproveitamento</span>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                          <Users size={24} className="text-blue-400" />
                        </div>
                        <span className="tag tag-warning">AGUARDANDO REFORÇO</span>
                      </div>
                      <h5 className="font-bold text-lg mb-2 tracking-tight">Módulo 2: Experiência do Cliente</h5>
                      <p className="text-sm text-zinc-500 mb-4 font-medium leading-relaxed">Comunicação, Empatia, Gestão de Conflitos e Feedback Pós-atendimento.</p>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <span>16 Horas</span>
                        <span>•</span>
                        <span>82% Aproveitamento</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-600/10 flex items-center justify-center group-hover:bg-emerald-600/20 transition-colors">
                          <TrendingUp size={24} className="text-emerald-400" />
                        </div>
                        <span className="tag tag-success">CONCLUÍDO</span>
                      </div>
                      <h5 className="font-bold text-lg mb-2 tracking-tight">Módulo 3: Análise de Dados (KPIs)</h5>
                      <p className="text-sm text-zinc-500 mb-4 font-medium leading-relaxed">Capacitação em TMA, TRPV, TFT, NPS e Metodologias de RCA (5 PQS).</p>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <span>24 Horas</span>
                        <span>•</span>
                        <span>88% Aproveitamento</span>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 opacity-60 grayscale-[50%]">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                          <ShieldCheck size={24} className="text-zinc-500" />
                        </div>
                        <span className="tag bg-zinc-800 text-zinc-500">BLOQUEADO</span>
                      </div>
                      <h5 className="font-bold text-lg mb-2 tracking-tight">Módulo 4: Simulações Práticas</h5>
                      <p className="text-sm text-zinc-600 mb-4 font-medium leading-relaxed">Cenários avançados de diagnóstico, checklists digitais e novas tecnologias FTTH.</p>
                      <p className="text-[10px] font-bold text-purple-500/50 uppercase tracking-widest">Início previsto: Setembro 2025</p>
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
}

export default App;
