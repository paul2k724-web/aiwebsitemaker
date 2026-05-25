import dedent from 'dedent';

export function getPremiumFallbackTemplate(prompt) {
    const p = prompt.toLowerCase();

    // 1. Todo App Fallback
    if (p.includes('todo') || p.includes('task') || p.includes('list')) {
        return {
            projectTitle: "Todo List App",
            theme: {
                fontFamily: "Outfit",
                primaryColor: "#3b82f6",
                backgroundColor: "#0b0f19",
                accentColor: "#ec4899",
                borderRadius: "12px"
            },
            sections: [
                {
                    id: "nav-1",
                    type: "navbar",
                    brandName: "PonderFlow ⚡",
                    links: ["Tasks", "Features", "Pricing"],
                    buttonText: "Logout"
                },
                {
                    id: "todo-app-1",
                    type: "custom",
                    code: dedent`
                    import React, { useState } from 'react';
                    import { Trash2, Plus, CheckCircle, Circle, ClipboardList, Sparkles, FolderOpen } from 'lucide-react';

                    export default function TodoApp1() {
                      const [tasks, setTasks] = useState([
                        { id: 1, text: "Design high-converting SaaS landing page", completed: true, category: "Work" },
                        { id: 2, text: "Configure stateless Gemini 2.5 Flash API routes", completed: false, category: "Development" },
                        { id: 3, text: "Review visual canvas editor responsive bounds", completed: false, category: "UI/UX" }
                      ]);
                      const [input, setInput] = useState("");
                      const [category, setCategory] = useState("Work");

                      const addTask = () => {
                        if (!input.trim()) return;
                        setTasks([...tasks, { id: Date.now(), text: input.trim(), completed: false, category }]);
                        setInput("");
                      };

                      const toggleTask = (id) => {
                        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
                      };

                      const deleteTask = (id) => {
                        setTasks(tasks.filter(t => t.id !== id));
                      };

                      const completedCount = tasks.filter(t => t.completed).length;

                      return (
                        <div className="min-h-screen bg-[#0b0f19] text-white p-6 md:p-12 font-sans">
                          <div className="max-w-4xl mx-auto space-y-8">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-900/50 border border-gray-800 p-8 rounded-2xl gap-4">
                              <div className="space-y-2">
                                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                                  <Sparkles className="h-6 w-6 text-blue-400" />
                                  <span>PonderFlow Task Manager</span>
                                </h1>
                                <p className="text-gray-400 text-sm font-mono">Streamline productivity, organize deliverables, and conquer your goals.</p>
                              </div>
                              <div className="bg-blue-600/10 border border-blue-500/20 px-5 py-3 rounded-xl flex items-center gap-3">
                                <div className="text-right">
                                  <div className="text-xs text-gray-500 uppercase tracking-wider font-mono">Completion</div>
                                  <div className="text-lg font-bold text-blue-400">{completedCount} of {tasks.length} tasks</div>
                                </div>
                              </div>
                            </div>

                            {/* Input Card */}
                            <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl space-y-4">
                              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-2">
                                <Plus className="h-4 w-4 text-blue-400" /> Add New Deliverable
                              </h3>
                              <div className="flex flex-col md:flex-row gap-3">
                                <input 
                                  type="text" 
                                  placeholder="What needs to be done?" 
                                  value={input}
                                  onChange={(e) => setInput(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                                  className="flex-1 bg-black/40 border border-gray-800 focus:border-blue-500 rounded-xl px-5 py-4 text-white outline-none font-sans placeholder-gray-500 transition-all"
                                />
                                <div className="flex gap-2">
                                  <select 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="bg-gray-800/80 border border-gray-700 focus:border-blue-500 text-gray-300 rounded-xl px-4 py-4 outline-none font-mono text-xs transition-all"
                                  >
                                    <option value="Work">💼 Work</option>
                                    <option value="Development">💻 Dev</option>
                                    <option value="UI/UX">🎨 UI/UX</option>
                                    <option value="Personal">🏠 Personal</option>
                                  </select>
                                  <button 
                                    onClick={addTask}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-4 rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-2 shrink-0"
                                  >
                                    <span>Add Task</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* List Section */}
                            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl overflow-hidden p-6 space-y-4">
                              <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-2">
                                  <ClipboardList className="h-4 w-4 text-blue-400" /> Deliverables Queue
                                </h3>
                                <span className="text-xs text-gray-500 font-mono">Real-time sync</span>
                              </div>

                              <div className="space-y-3">
                                {tasks.length === 0 ? (
                                  <div className="p-12 text-center text-gray-500 font-mono text-sm space-y-3">
                                    <FolderOpen className="h-8 w-8 mx-auto text-gray-600" />
                                    <p>No active tasks found in the workspace queue.</p>
                                  </div>
                                ) : (
                                  tasks.map(task => (
                                    <div 
                                      key={task.id} 
                                      className={\`flex items-center justify-between p-5 border rounded-xl transition-all duration-200 \${
                                        task.completed 
                                          ? 'bg-black/20 border-gray-800 opacity-60' 
                                          : 'bg-black/40 border-gray-800 hover:border-gray-700 hover:bg-gray-900/20'
                                      }\`}
                                    >
                                      <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <button 
                                          onClick={() => toggleTask(task.id)}
                                          className="text-blue-400 hover:text-blue-300 transition-colors shrink-0"
                                        >
                                          {task.completed ? (
                                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                                          ) : (
                                            <Circle className="h-5 w-5 text-gray-500 hover:text-blue-400" />
                                          )}
                                        </button>
                                        <span className={\`text-sm font-medium truncate \${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}\`}>
                                          {task.text}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3 ml-4 shrink-0">
                                        <span className="bg-gray-800/80 border border-gray-700 text-gray-400 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded">
                                          {task.category}
                                        </span>
                                        <button 
                                          onClick={() => deleteTask(task.id)}
                                          className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                                          title="Delete Deliverable"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    `
                },
                {
                    id: "footer-1",
                    type: "footer",
                    text: "© 2026 PonderFlow Inc. Empowering workspace productivity."
                }
            ]
        };
    }

    // 2. Music Streaming App Fallback
    if (p.includes('music') || p.includes('song') || p.includes('stream') || p.includes('audio') || p.includes('rhythm')) {
        return {
            projectTitle: "Music Streaming Player",
            theme: {
                fontFamily: "Outfit",
                primaryColor: "#a855f7",
                backgroundColor: "#090514",
                accentColor: "#f43f5e",
                borderRadius: "16px"
            },
            sections: [
                {
                    id: "nav-1",
                    type: "navbar",
                    brandName: "RhythmFlow 🎵",
                    links: ["Queue", "Playlists", "Settings"],
                    buttonText: "Upgrade Pro"
                },
                {
                    id: "music-player-1",
                    type: "custom",
                    code: dedent`
                    import React, { useState } from 'react';
                    import { Play, Pause, SkipForward, SkipBack, Music, Volume2, ListMusic, Sparkles, Heart } from 'lucide-react';

                    export default function MusicPlayer1() {
                      const [playing, setPlaying] = useState(false);
                      const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
                      const [liked, setLiked] = useState(false);

                      const playlist = [
                        { title: "Midnight Synthesis", artist: "Hyperion Drive", duration: "3:45", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=150&q=80" },
                        { title: "Neon Skyline", artist: "Arcade Vapor", duration: "4:12", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80" },
                        { title: "Solar Wind", artist: "Nova Nebula", duration: "2:58", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80" }
                      ];

                      const currentTrack = playlist[currentTrackIndex];

                      const handleNext = () => {
                        setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
                        setPlaying(true);
                      };

                      const handlePrev = () => {
                        setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
                        setPlaying(true);
                      };

                      return (
                        <div className="min-h-screen bg-[#090514] text-white p-6 md:p-12 font-sans flex items-center justify-center">
                          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch bg-gray-950/60 border border-purple-950/50 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
                            
                            {/* Left: Player Section */}
                            <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                              <div className="space-y-2">
                                <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                                  <Sparkles className="h-5 w-5 text-purple-400" />
                                  <span>Now Streaming</span>
                                </h2>
                                <p className="text-gray-400 text-xs font-mono">Elevate your sonic senses with high-definition audio.</p>
                              </div>

                              {/* Album Art Mockup */}
                              <div className="relative group aspect-video rounded-2xl overflow-hidden border border-purple-500/20 shadow-xl">
                                <img src={currentTrack.cover} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" alt="Cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex items-end p-6">
                                  <div className="space-y-1">
                                    <h3 className="text-2xl font-extrabold text-white tracking-tight">{currentTrack.title}</h3>
                                    <p className="text-purple-300 text-sm font-medium">{currentTrack.artist}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Player Controls */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                                  <span>1:24</span>
                                  <div className="flex-1 mx-4 h-1.5 bg-purple-950 rounded-full overflow-hidden">
                                    <div className="w-1/3 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                                  </div>
                                  <span>{currentTrack.duration}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <button onClick={() => setLiked(!liked)} className="text-gray-500 hover:text-pink-400 transition-colors">
                                    <Heart className={\`h-6 w-6 \${liked ? 'fill-pink-500 text-pink-500' : ''}\`} />
                                  </button>
                                  <div className="flex items-center gap-6">
                                    <button onClick={handlePrev} className="text-gray-400 hover:text-white p-2.5 rounded-full bg-purple-950/20 hover:bg-purple-950/50 transition-all">
                                      <SkipBack className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => setPlaying(!playing)} className="p-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg shadow-purple-500/20 active:scale-95 transition-all">
                                      {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-white" />}
                                    </button>
                                    <button onClick={handleNext} className="text-gray-400 hover:text-white p-2.5 rounded-full bg-purple-950/20 hover:bg-purple-950/50 transition-all">
                                      <SkipForward className="h-5 w-5" />
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-500">
                                    <Volume2 className="h-5 w-5 text-purple-400/80" />
                                    <div className="w-16 h-1 bg-purple-950 rounded-full overflow-hidden">
                                      <div className="w-4/5 h-full bg-purple-400" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right: Playlist Sidebar */}
                            <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-purple-950/40 pt-6 md:pt-0 md:pl-6 flex flex-col space-y-6">
                              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider font-mono flex items-center gap-2">
                                <ListMusic className="h-4 w-4" /> Next in Queue
                              </h3>
                              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                                {playlist.map((track, index) => (
                                  <button 
                                    key={index}
                                    onClick={() => {
                                      setCurrentTrackIndex(index);
                                      setPlaying(true);
                                    }}
                                    className={\`w-full p-4 flex items-center justify-between border rounded-2xl text-left transition-all duration-300 group \${
                                      index === currentTrackIndex 
                                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' 
                                        : 'bg-black/20 border-purple-950/25 hover:border-purple-800/40 hover:bg-purple-950/10'
                                    }\`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="relative shrink-0 w-10 h-10 rounded-lg overflow-hidden">
                                        <img src={track.cover} className="w-full h-full object-cover" alt="Cover" />
                                        {index === currentTrackIndex && playing && (
                                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="flex gap-0.5 items-end h-3">
                                              <div className="w-0.5 bg-purple-400 animate-bounce h-full" style={{ animationDelay: '0.1s' }} />
                                              <div className="w-0.5 bg-purple-400 animate-bounce h-2/3" style={{ animationDelay: '0.3s' }} />
                                              <div className="w-0.5 bg-purple-400 animate-bounce h-full" style={{ animationDelay: '0.5s' }} />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="min-w-0">
                                        <h4 className="font-bold text-sm truncate">{track.title}</h4>
                                        <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                                      </div>
                                    </div>
                                    <span className="text-xs text-gray-600 font-mono shrink-0 ml-3">{track.duration}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    `
                },
                {
                    id: "footer-1",
                    type: "footer",
                    text: "© 2026 RhythmFlow Inc. Sound systems engineered for conversion."
                }
            ]
        };
    }

    // 3. Budget Tracker Fallback
    if (p.includes('finance') || p.includes('budget') || p.includes('money') || p.includes('pay') || p.includes('wallet') || p.includes('account')) {
        return {
            projectTitle: "Personal Finance Tracker",
            theme: {
                fontFamily: "Outfit",
                primaryColor: "#10b981",
                backgroundColor: "#040d0a",
                accentColor: "#10b981",
                borderRadius: "12px"
            },
            sections: [
                {
                    id: "nav-1",
                    type: "navbar",
                    brandName: "ApexFinance 📈",
                    links: ["Overview", "Transactions", "Budget"],
                    buttonText: "Link Bank"
                },
                {
                    id: "finance-tracker-1",
                    type: "custom",
                    code: dedent`
                    import React, { useState } from 'react';
                    import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, TrendingUp, Plus, Trash2, Sparkles } from 'lucide-react';

                    export default function FinanceTracker1() {
                      const [transactions, setTransactions] = useState([
                        { id: 1, text: "UI Design Project Payout", amount: 1200, type: "income" },
                        { id: 2, text: "Google AI API Billing", amount: -45, type: "expense" },
                        { id: 3, text: "SaaS Workspace Subscription", amount: -29, type: "expense" }
                      ]);
                      const [desc, setDesc] = useState("");
                      const [amount, setAmount] = useState("");
                      const [txType, setTxType] = useState("income");

                      const addTransaction = () => {
                        if (!desc.trim() || !amount) return;
                        const amt = Math.abs(parseFloat(amount));
                        setTransactions([
                          ...transactions,
                          {
                            id: Date.now(),
                            text: desc.trim(),
                            amount: txType === 'income' ? amt : -amt,
                            type: txType
                          }
                        ]);
                        setDesc("");
                        setAmount("");
                      };

                      const deleteTransaction = (id) => {
                        setTransactions(transactions.filter(t => t.id !== id));
                      };

                      const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
                      const expenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0));
                      const balance = income - expenses;

                      return (
                        <div className="min-h-screen bg-[#040d0a] text-white p-6 md:p-12 font-sans">
                          <div className="max-w-4xl mx-auto space-y-8">
                            
                            {/* Header */}
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-emerald-950/15 border border-emerald-950/40 p-8 rounded-2xl gap-4">
                              <div className="space-y-2">
                                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-2">
                                  <Sparkles className="h-6 w-6 text-emerald-400" />
                                  <span>ApexFinance Ledger</span>
                                </h1>
                                <p className="text-gray-400 text-sm font-mono">Monitor allocations, audit expenditures, and accelerate net worth.</p>
                              </div>
                            </div>

                            {/* Cards overview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="p-6 bg-gray-950/50 border border-emerald-950/20 rounded-2xl flex items-center justify-between">
                                <div className="space-y-1">
                                  <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Total Balance</span>
                                  <h3 className={\`text-2xl font-bold font-mono \${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}\`}>\${balance.toLocaleString()}</h3>
                                </div>
                                <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
                                  <Wallet className="h-5 w-5" />
                                </div>
                              </div>

                              <div className="p-6 bg-gray-950/50 border border-emerald-950/20 rounded-2xl flex items-center justify-between">
                                <div className="space-y-1">
                                  <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Audit Revenue</span>
                                  <h3 className="text-2xl font-bold font-mono text-emerald-400">\${income.toLocaleString()}</h3>
                                </div>
                                <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
                                  <ArrowUpRight className="h-5 w-5" />
                                </div>
                              </div>

                              <div className="p-6 bg-gray-950/50 border border-emerald-950/20 rounded-2xl flex items-center justify-between">
                                <div className="space-y-1">
                                  <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Expenditures</span>
                                  <h3 className="text-2xl font-bold font-mono text-rose-400">-\${expenses.toLocaleString()}</h3>
                                </div>
                                <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
                                  <ArrowDownRight className="h-5 w-5" />
                                </div>
                              </div>
                            </div>

                            {/* Add Transaction */}
                            <div className="bg-gray-950/40 border border-emerald-950/15 p-6 rounded-2xl space-y-4">
                              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-2">
                                <Plus className="h-4 w-4 text-emerald-400" /> Log Transaction
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                <input 
                                  type="text" 
                                  placeholder="Description (e.g., Client Retainer)" 
                                  value={desc}
                                  onChange={(e) => setDesc(e.target.value)}
                                  className="md:col-span-5 bg-black/40 border border-emerald-950/30 focus:border-emerald-500 rounded-xl px-5 py-4 text-white outline-none font-sans placeholder-gray-600 transition-all text-sm"
                                />
                                <input 
                                  type="number" 
                                  placeholder="Amount ($)" 
                                  value={amount}
                                  onChange={(e) => setAmount(e.target.value)}
                                  className="md:col-span-3 bg-black/40 border border-emerald-950/30 focus:border-emerald-500 rounded-xl px-5 py-4 text-white outline-none font-mono placeholder-gray-600 transition-all text-sm"
                                />
                                <select 
                                  value={txType} 
                                  onChange={(e) => setTxType(e.target.value)}
                                  className="md:col-span-2 bg-gray-900 border border-emerald-950/30 focus:border-emerald-500 text-gray-300 rounded-xl px-4 py-4 outline-none font-mono text-xs transition-all"
                                >
                                  <option value="income">📈 Credit</option>
                                  <option value="expense">📉 Debit</option>
                                </select>
                                <button 
                                  onClick={addTransaction}
                                  className="md:col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all duration-200 active:scale-95 shrink-0 text-sm flex items-center justify-center"
                                >
                                  Add Logs
                                </button>
                              </div>
                            </div>

                            {/* Transaction List */}
                            <div className="bg-gray-950/30 border border-emerald-950/15 rounded-2xl p-6 space-y-4">
                              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-emerald-400" /> Transaction Archives
                              </h3>
                              <div className="space-y-3">
                                {transactions.map(t => (
                                  <div 
                                    key={t.id} 
                                    className="flex items-center justify-between p-5 bg-black/40 border border-emerald-950/10 hover:border-emerald-950/30 rounded-xl transition-all"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={\`p-2.5 rounded-lg shrink-0 \${
                                        t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                      }\`}>
                                        {t.type === 'income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                      </div>
                                      <span className="text-sm font-medium text-gray-200">{t.text}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className={\`text-sm font-bold font-mono \${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}\`}>
                                        {t.type === 'income' ? '+' : ''}\${t.amount.toLocaleString()}
                                      </span>
                                      <button 
                                        onClick={() => deleteTransaction(t.id)}
                                        className="text-gray-600 hover:text-rose-400 transition-colors p-1"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    `
                },
                {
                    id: "footer-1",
                    type: "footer",
                    text: "© 2026 ApexFinance Inc. Assets protected by audited ledger encryption."
                }
            ]
        };
    }

    // 4. Default Premium Landing Page
    return {
        projectTitle: "Modern Business Platform",
        theme: {
            fontFamily: "Outfit",
            primaryColor: "#3b82f6",
            backgroundColor: "#0b0f19",
            accentColor: "#ec4899",
            borderRadius: "12px"
        },
        sections: [
            {
                id: "nav-1",
                type: "navbar",
                brandName: "ApexCorp ⚡",
                links: ["Home", "Features", "Pricing", "FAQ"],
                buttonText: "Get Started"
            },
            {
                id: "hero-1",
                type: "hero",
                title: "Accelerate Platform Velocity",
                subtitle: "Unlock robust structural component nodes, real-time sync systems, and gorgeous micro-animations out of the box.",
                primaryBtn: "Claim Free Trial",
                secondaryBtn: "Read Docs",
                bgGradient: "from-blue-600/20 via-purple-600/10 to-transparent",
                imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80"
            },
            {
                id: "features-1",
                type: "features",
                title: "Engineered for Velocity",
                subtitle: "Beautiful sections designed for maximum conversion parameters.",
                items: [
                    { icon: "Zap", title: "Lightning Fast Integration", desc: "Vite and Tailwind preconfigured files deploy in seconds." },
                    { icon: "Layers", title: "Visual Editing Sidebars", desc: "Control typography, margins, backgrounds, and copy in real-time." },
                    { icon: "Code", title: "Developer exports", desc: "Synchronized clean component code exportable in a single ZIP." }
                ]
            },
            {
                id: "footer-1",
                type: "footer",
                text: "© 2026 ApexCorp Inc. Empowering developers worldwide."
            }
        ]
    };
}
