import React, { useState, useEffect } from 'react';
import { 
  Home, Database, Wand2, CalendarDays, Settings, ShieldAlert, BookOpen, 
  CheckCircle2, XCircle, LogOut 
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, get, child } from "firebase/database";

// =========================================================================
// --- IMPORTS MODULAR (WAJIB ADA AGAR TIDAK BLANK) ---
// =========================================================================
import { DEFAULT_MASTER_RHK_DATA } from './utils/constants.js';
import LoginView from './views/LoginView.jsx';
import DashboardView from './views/DashboardView.jsx';
import EngineView from './views/EngineView.jsx';
import DatabaseView from './views/DatabaseView.jsx';
import AgendaView from './views/AgendaView.jsx';
import SettingsView from './views/SettingsView.jsx';
import AdminView from './views/AdminView.jsx';
import PanduanView from './views/PanduanView.jsx';

// =========================================================================
// --- FIREBASE CONFIGURATION (VERCEL .ENV) ---
// =========================================================================
// Menggunakan murni import.meta.env sesuai standar Vite.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// =========================================================================
// --- UI COMPONENTS PENDUKUNG (SHELL NAVIGASI) ---
// =========================================================================
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center transition-all duration-300">
     <div className="relative flex items-center justify-center w-32 h-32 mb-6">
        <div className="absolute inset-0 border-4 border-t-blue-700 border-r-transparent border-b-emerald-600 border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-t-transparent border-r-amber-500 border-b-transparent border-l-blue-600 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
        <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain z-10 animate-pulse drop-shadow-md" />
     </div>
     <h2 className="text-blue-800 font-black tracking-widest animate-pulse drop-shadow-sm">MEMPROSES...</h2>
  </div>
);

const ToastAlert = ({ toast }) => (
  <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-2 px-5 py-3 rounded-full shadow-xl border transition-all duration-500 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'} ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
    {toast.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-600"/> : <XCircle size={20} className="text-red-600"/>}
    <span className="text-sm font-bold">{toast.msg}</span>
  </div>
);

const HeaderMobile = ({ setView, role, pendingTx }) => (
  <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm">
    <h1 className="text-xl font-black text-blue-800 flex items-center gap-2 tracking-tight">
      <img src="/logo.png" alt="GL Logo" className="w-7 h-7 object-contain" /> E-GenLap
    </h1>
    <div className="flex gap-4">
      {role === 'admin' && (
        <button onClick={() => setView('admin')} className="relative text-slate-500 hover:text-amber-600 transition-colors">
          <ShieldAlert size={22} />
          {pendingTx > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>}
        </button>
      )}
    </div>
  </header>
);

const DesktopSidebar = ({ view, setView, role, pendingTx, handleLogout }) => {
  const NavItem = ({ icon, label, target, colorClass }) => (
    <button onClick={() => setView(target)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${view === target ? `bg-${colorClass}-50 text-${colorClass}-700 shadow-sm border border-${colorClass}-100` : 'text-slate-500 hover:bg-slate-50 hover:text-blue-700'}`}>
      {icon} <span className="text-sm">{label}</span>
    </button>
  );
  return (
    <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 fixed left-0 top-0 h-screen shadow-sm z-50">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <img src="/logo.png" alt="GL Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
        <div><h1 className="text-xl font-black text-blue-800 tracking-tight leading-tight">E-GenLap</h1><p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Kemensos RI</p></div>
      </div>
      <div className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Menu Utama</p>
        <NavItem icon={<Home size={20} />} label="Beranda" target="dashboard" colorClass="blue" />
        <NavItem icon={<Database size={20} />} label="Data Laporan" target="database" colorClass="emerald" />
        <NavItem icon={<Wand2 size={20} />} label="Buat Laporan AI" target="engine" colorClass="amber" />
        <NavItem icon={<CalendarDays size={20} />} label="Agenda & Giat" target="agenda" colorClass="blue" />
        <div className="pt-6 pb-2"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Pengaturan</p></div>
        <NavItem icon={<Settings size={20} />} label="Profil & Storage" target="settings" colorClass="slate" />
        <NavItem icon={<BookOpen size={20} />} label="Buku Panduan" target="panduan" colorClass="slate" />
        {role === 'admin' && (
          <div className="relative">
            <NavItem icon={<ShieldAlert size={20} />} label="Panel Admin" target="admin" colorClass="red" />
            {pendingTx > 0 && <span className="absolute top-3 right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingTx}</span>}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-slate-100">
         <button onClick={handleLogout} className="w-full flex items-center gap-2 justify-center text-red-600 font-bold bg-red-50 hover:bg-red-100 py-3 rounded-xl transition-colors"><LogOut size={16} /> Keluar Sistem</button>
      </div>
    </aside>
  );
};

const BottomNav = ({ view, setView }) => {
  const NavBtn = ({ icon, label, target, activeColor }) => (
    <button onClick={() => setView(target)} className={`flex flex-col items-center gap-1 w-16 transition-colors ${view === target ? activeColor : 'text-slate-400 hover:text-blue-600'}`}>
      <div className={`${view === target ? 'scale-110 transition-transform' : ''}`}>{icon}</div><span className="text-[9px] font-bold">{label}</span>
    </button>
  );
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 rounded-t-3xl flex justify-around items-center p-2 pb-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <NavBtn icon={<Home size={22} />} label="Beranda" target="dashboard" activeColor="text-blue-700" />
      <NavBtn icon={<Database size={22} />} label="Data" target="database" activeColor="text-emerald-600" />
      <div className="relative -top-6"><button onClick={() => setView('engine')} className="bg-blue-700 hover:bg-blue-800 text-white w-14 h-14 rounded-full border-4 border-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"><Wand2 size={24} /></button></div>
      <NavBtn icon={<CalendarDays size={22} />} label="Agenda" target="agenda" activeColor="text-blue-700" />
      <NavBtn icon={<User size={22} />} label="Profil" target="settings" activeColor="text-slate-700" />
    </nav>
  );
};

// =========================================================================
// --- APP ROUTER UTAMA ---
// =========================================================================
export default function App() {
  const safeParseJSON = (key, defaultVal) => { try { const val = localStorage.getItem(key); return val ? JSON.parse(val) : defaultVal; } catch (e) { return defaultVal; } };

  // GLOBAL STATES
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [role, setRole] = useState(() => localStorage.getItem('egenlap_role') || 'user');
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  
  // STATE DATABASES
  const [pendingTx, setPendingTx] = useState(0); 
  const [masterRhk, setMasterRhk] = useState(DEFAULT_MASTER_RHK_DATA);
  const [agendaFilter, setAgendaFilter] = useState({ type: null, value: null });
  const [adminConfig, setAdminConfig] = useState({ geminiApiKeys: '' });

  // STATE LOKAL & CLOUD
  const [tokens, setTokens] = useState(() => safeParseJSON('egenlap_tokens', 3));
  const [reports, setReports] = useState(() => safeParseJSON('egenlap_reports', []));
  const [agendas, setAgendas] = useState(() => safeParseJSON('egenlap_agendas', []));
  const [adminUsersData, setAdminUsersData] = useState([]);
  
  const [profile, setProfile] = useState(() => {
    const stored = safeParseJSON('egenlap_profile', null);
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
       return { nama: '', nip: '', emailTarget: '', kabupaten: '', jabatanAsn: '', jabatanPkh: '', ttdBase64: '', driveId: '', sheetId: '', ...stored };
    }
    return { nama: '', nip: '', emailTarget: '', kabupaten: '', jabatanAsn: '', jabatanPkh: '', ttdBase64: '', driveId: '', sheetId: '' };
  });

  // =========================================================================
  // --- FIREBASE REALTIME DB SINKRONISASI ---
  // =========================================================================
  useEffect(() => {
    // 1. Tarik Data RHK Master Terbaru dari Admin
    const rhkRef = ref(db, 'masterRhk');
    const unsubRhk = onValue(rhkRef, (snapshot) => {
      if(snapshot.exists()) setMasterRhk(snapshot.val());
    });

    // 2. Tarik Data Spesifik User Saat Ini (Tokens, Laporan, Profil)
    let unsubUser = () => {};
    if (auth.currentUser) {
       const userRef = ref(db, `users/${auth.currentUser.uid}`);
       unsubUser = onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
             const data = snapshot.val();
             if (data.tokens !== undefined) setTokens(data.tokens);
             if (data.reports) {
                const reportsArray = Object.values(data.reports).sort((a, b) => b.id - a.id);
                setReports(reportsArray);
             }
             if (data.agendas) {
                const agendasArray = Object.values(data.agendas).sort((a, b) => b.id - a.id);
                setAgendas(agendasArray);
             }
             
             // Jangan menimpa TTD Base64 dari cloud jika tidak perlu (karena berat)
             setProfile(prev => ({
                ...prev,
                nama: data.nama || prev.nama,
                jabatanPkh: data.jabatanPkh || prev.jabatanPkh,
                jabatanAsn: data.jabatanAsn || prev.jabatanAsn,
                kabupaten: data.kabupaten || prev.kabupaten,
                driveId: data.driveId || prev.driveId,
                sheetId: data.sheetId || prev.sheetId,
             }));
          }
       });
    }

    // 3. Tarik Data Semua User (Khusus Panel Admin)
    let unsubAdmin = () => {};
    if (role === 'admin') {
       const allUsersRef = ref(db, 'users');
       unsubAdmin = onValue(allUsersRef, (snapshot) => {
          if (snapshot.exists()) {
             const data = snapshot.val();
             const usersArr = Object.keys(data).map(key => ({ id: key, ...data[key] }));
             setAdminUsersData(usersArr);
          }
       });
    }

    return () => { unsubRhk(); unsubUser(); unsubAdmin(); };
  }, [isLoggedIn, role]);

  // PERSISTENCE LOCAL STORAGE PENGAMAN
  useEffect(() => { localStorage.setItem('egenlap_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('egenlap_reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('egenlap_agendas', JSON.stringify(agendas)); }, [agendas]);
  useEffect(() => { localStorage.setItem('egenlap_tokens', JSON.stringify(tokens)); }, [tokens]);

  // CEK AUTHENTIKASI FIREBASE SAAT APLIKASI DIBUKA
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const isSuperAdmin = localStorage.getItem('egenlap_superadmin') === 'true';
      if (isSuperAdmin) {
         setRole('admin'); setIsLoggedIn(true); setView('admin');
      } else if (user) {
         setRole('user'); setIsLoggedIn(true); setView('dashboard');
         // Sinkronisasi data sekali saat baru login
         const dbRef = ref(db);
         const snapshot = await get(child(dbRef, `users/${user.uid}`));
         if (snapshot.exists()) {
             setProfile(prev => ({ ...prev, ...snapshot.val() }));
         }
      } else {
         setIsLoggedIn(false); setView('login');
      }
      setLoading(false); setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
      setLoading(true);
      try {
          await signOut(auth);
          localStorage.removeItem('egenlap_superadmin');
          localStorage.setItem('egenlap_role', 'user');
          setIsLoggedIn(false); setRole('user'); setView('login');
          showToast("Berhasil Keluar", "success");
      } catch (error) {
          showToast("Gagal Logout", "error");
      } finally {
          setLoading(false);
      }
  };

  const showLoading = (param, nextView = null) => { 
      if (typeof param === 'boolean') {
          setLoading(param);
          if (nextView) setView(nextView);
      } else {
          setLoading(true); 
          setTimeout(() => { 
              setLoading(false); 
              if (nextView) setView(nextView); 
          }, param); 
      }
  };
  
  const showToast = (msg, type = 'success') => { 
      setToast({ show: true, msg, type }); 
      setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 4000); 
  };

  if (!authInitialized) return <LoadingScreen />;
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-blue-200 selection:text-blue-900 pb-24 md:pb-0 flex justify-center md:justify-start">
      {isLoggedIn && <DesktopSidebar view={view} setView={setView} role={role} pendingTx={pendingTx} handleLogout={handleLogout} />}

      <div className={`w-full ${isLoggedIn ? 'md:ml-72' : ''} flex flex-col min-h-screen mx-auto bg-slate-50 relative z-10 max-w-md md:max-w-4xl`}>
        {loading && <LoadingScreen />}
        <ToastAlert toast={toast} />

        {isLoggedIn && <HeaderMobile setView={setView} role={role} pendingTx={pendingTx} />}

        <main className={`flex-grow ${!isLoggedIn ? 'p-0 w-full overflow-hidden' : 'p-5 md:p-8 w-full'}`}>
          {!isLoggedIn && view === 'login' && <LoginView auth={auth} db={db} setView={setView} setRole={setRole} showLoading={showLoading} showToast={showToast} profile={profile} setProfile={setProfile} setIsLoggedIn={setIsLoggedIn} />}
          
          {isLoggedIn && view === 'dashboard' && <DashboardView profile={profile} tokens={tokens} reports={reports} masterRhk={masterRhk} />}
          
          {isLoggedIn && view === 'engine' && <EngineView profile={profile} tokens={tokens} role={role} setTokens={setTokens} showLoading={showLoading} showToast={showToast} reports={reports} setReports={setReports} masterRhk={masterRhk} setView={setView} auth={auth} db={db} />}
          
          {isLoggedIn && view === 'database' && <DatabaseView reports={reports} />}
          
          {isLoggedIn && view === 'agenda' && <AgendaView profile={profile} agendas={agendas} setAgendas={setAgendas} masterRhk={masterRhk} agendaFilter={agendaFilter} setAgendaFilter={setAgendaFilter} showToast={showToast} auth={auth} db={db} />}
          
          {isLoggedIn && view === 'settings' && <SettingsView profile={profile} setProfile={setProfile} tokens={tokens} role={role} showToast={showToast} showLoading={showLoading} setView={setView} pendingTx={pendingTx} setPendingTx={setPendingTx} handleLogout={handleLogout} auth={auth} db={db} />}
          
          {isLoggedIn && view === 'admin' && <AdminView showLoading={showLoading} showToast={showToast} adminConfig={adminConfig} setAdminConfig={setAdminConfig} db={db} masterRhk={masterRhk} setMasterRhk={setMasterRhk} adminUsersData={adminUsersData} pendingTx={pendingTx} setPendingTx={setPendingTx} />}
          
          {isLoggedIn && view === 'panduan' && <PanduanView />}
        </main>

        {isLoggedIn && <BottomNav view={view} setView={setView} />}
      </div>
    </div>
  );
}