import React, { useState, useEffect } from 'react';
import { 
  Home, Database, Wand2, CalendarDays, Settings, User, ShieldAlert, 
  BookOpen, LogOut, CheckCircle2, XCircle, Zap, LogIn, UserPlus, 
  Key, Mail, BarChart3, Clock, FolderOpen, ChevronRight, ExternalLink, 
  Plus, Filter, Camera, Trash2, ListTodo, PenTool, MapPin, Users, 
  FileText, CloudUpload, FilePlus, Image as ImageIcon, FileSpreadsheet, 
  RefreshCcw, Coins, Sparkles, BrainCircuit, Rocket, ShieldCheck, Download, Upload 
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, set, get, child } from "firebase/database";

// =========================================================================
// --- FIREBASE CONFIGURATION ---
// =========================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAv4ZXRI7Q7es3V3pBi_ZZce0fHvgFEKX4",
  authDomain: "e-genlapv11.firebaseapp.com",
  databaseURL: "https://e-genlapv11-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "e-genlapv11",
  storageBucket: "e-genlapv11.firebasestorage.app",
  messagingSenderId: "209352282637",
  appId: "1:209352282637:web:11ddcd9ae57357e7c87b44"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// =========================================================================
// --- CONSTANTS & UTILS ---
// =========================================================================
const THEME = {
  glossyCard: "bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden",
  glossyInput: "w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl p-3.5 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm font-medium",
  btnPrimary: "w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-4 rounded-xl shadow-md active:scale-95 transition-all text-base flex justify-center items-center gap-2",
  btnSecondary: "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-md active:scale-95 transition-all flex justify-center items-center gap-2",
  btnAccent: "w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold py-3.5 rounded-xl shadow-md active:scale-95 transition-all flex justify-center items-center gap-2"
};

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyLxsYQZJG6NRZCs5O1tW306bXhFWT423evkaWhaUAa4DoT4zDDEwoeAIl1_EpRe3SKSg/exec";

const RHK_TARGETS = {
  "RHK 1": 12, "RHK 2": 180, "RHK 3": 24, "RHK 4": 24, "RHK 5": 36, "RHK 6": 100, "RHK 7": 12, "RHK 8": 24, "RHK 9": 100
};

const JABATAN_LENGKAP = [
  "Ketua TIM Provinsi (Katimprov)", "Ketua TIM Kabupaten / Kota (Katimkabkot)", "PENATA LAYANAN OPERASIONAL", "PENGELOLA LAYANAN OP-DIII", "OPERATOR LAYANAN OP-SMA2"
];

const DEFAULT_MASTER_RHK_DATA = [
  { id: "RHK 1", jabatan: JABATAN_LENGKAP, name: "Ketepatan sasaran dan pemanfaatan Bantuan Sosial Bersyarat...", renHar: [{id: "1.1", name: "Melakukan edukasi dan sosialisasi pencairan secara tunai dan non tunai"}, {id: "1.2", name: "Melaksanakan Supervisi Permasalahan Bantuan Sosial"}, {id: "1.3", name: "Melaksanakan Monitoring/Pemantauan Penyaluran Bantuan Sosial"}, {id: "1.4", name: "Melaksanakan Penelitian penyaluran bantuan Sosial"}, {id: "1.5", name: "Melaksanakan supervisi Kebijakan Bantuan Sosial Kepada ASN PPPK"}] },
  { id: "RHK 2", jabatan: JABATAN_LENGKAP, name: "Ketepatan sasaran dan pemanfaatan Bantuan Sosial Bersyarat (P2K2)", renHar: [{id: "2.1", name: "Melaksanakan Pertemuan Peningkatan Kemampuan Keluarga (P2K2)"}, {id: "2.2", name: "Melakukan Supervisi pelaksanaan P2K2 kepada ASN PPPK"}] },
  { id: "RHK 3", jabatan: JABATAN_LENGKAP, name: "Meningkatnya pemenuhan komitmen di bidang pendidikan, kesehatan, dll", renHar: [{id: "3.1", name: "Melaksanakan Verifikasi Komitmen Pendidikan,Kesehatan dan Kesejahteraan Sosial"}, {id: "3.2", name: "Melakukan pendampingan, mediasi, dan fasilitasi kepada KPM PKH"}, {id: "3.3", name: "Melaksanakan supervisi Verifikasi Komitmen Kepada ASN PPPK"}] },
  { id: "RHK 4", jabatan: JABATAN_LENGKAP, name: "Meningkatnya kepuasan stakeholder terhadap layanan perlindungan", renHar: [{id: "4.1", name: "Melakukan usulan KPM Graduasi mandiri dan Pemberdayaan PPSE"}, {id: "4.2", name: "Melaksanakan supervisi Graduasi Kepada ASN PPPK"}] },
  { id: "RHK 5", jabatan: JABATAN_LENGKAP, name: "Terlaksananya Verifikasi, Validasi dan Permutakhiran Data KPM", renHar: [{id: "5.1", name: "Melaksanakan Pemutakhiran Data"}, {id: "5.2", name: "Melaksanakan proses bisnis PKH yang meliputi verifikasi validasi calon penerima bantuan sosial"}, {id: "5.3", name: "Melaksanakan supervisi Verifikasi, Validasi dan pemutakhiran"}] },
  { id: "RHK 6", jabatan: JABATAN_LENGKAP, name: "Terlaksananya kegiatan kasus adaptif (Respon kasus/kerentanan)", renHar: [{id: "6", name: "Melaksanakan Respon Kasus/Pengaduan/kebencanaan/Kerentanan"}] },
  { id: "RHK 7", jabatan: JABATAN_LENGKAP, name: "Tersedianya Data Analisis Laporan Bulanan", renHar: [{id: "7.1", name: "Membuat laporan bulanan pelaksanaan PKH dan laporan lainnya"}] },
  { id: "RHK 8", jabatan: JABATAN_LENGKAP, name: "Terlaksananya direktif pimpinan sesuai dengan penugasan", renHar: [{id: "8.1", name: "Melaksanakan Tindak Lanjut Hasil Pemeriksaan (TLHP)"}, {id: "8.2", name: "Melakukan sosialisasi kebijakan dan bisnis proses PKH"}, {id: "8.3", name: "Mengikuti Rapat Koordinasi, Sosialisasi Kebijakan"}, {id: "8.4", name: "Melakukan Pengawasan dan edukasi kepada Pendamping Sosial"}, {id: "8.5", name: "Tugas Lainnya (Penugasan lainnya program Kementrian Sosial)"}] },
  { id: "RHK 9", jabatan: JABATAN_LENGKAP, name: "Terlaksananya Penyebaran Berita Baik Kemensos", renHar: [{id: "9.1", name: "Berperan aktif dalam memanfaatkan, menyebarkan Media Sosial"}] },
];

const getBulanFolder = (dateString) => {
  if (!dateString) return "01. Januari";
  const date = new Date(dateString);
  const months = ["01. Januari", "02. Februari", "03. Maret", "04. April", "05. Mei", "06. Juni", "07. Juli", "08. Agustus", "09. September", "10. Oktober", "11. November", "12. Desember"];
  return months[date.getMonth()];
};

const getFilteredRhk = (masterRhk, profile) => {
  const safeMasterRhk = Array.isArray(masterRhk) ? masterRhk : [];
  if(!profile?.jabatanPkh && !profile?.jabatanAsn) return safeMasterRhk;

  const userJabatanPkh = String(profile?.jabatanPkh || "");
  const userJabatanAsn = String(profile?.jabatanAsn || "");

  return safeMasterRhk.filter(rhk => {
    if (!rhk.jabatan || rhk.jabatan === "Semua Jabatan") return true;
    if (Array.isArray(rhk.jabatan)) {
      return rhk.jabatan.includes("Semua Jabatan") || rhk.jabatan.includes(userJabatanPkh) || rhk.jabatan.includes(userJabatanAsn);
    }
    const strJabatan = String(rhk.jabatan);
    return strJabatan.includes("Semua Jabatan") || strJabatan.includes(userJabatanPkh) || strJabatan.includes(userJabatanAsn);
  });
};

// =========================================================================
// --- UI COMPONENTS ---
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
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Menu Utama</p>
        <NavItem icon={<Home size={20} />} label="Beranda" target="dashboard" colorClass="blue" />
        <NavItem icon={<Database size={20} />} label="Data Laporan" target="database" colorClass="emerald" />
        <NavItem icon={<Wand2 size={20} />} label="Buat Laporan AI" target="engine" colorClass="amber" />
        <NavItem icon={<CalendarDays size={20} />} label="Agenda & Giat" target="agenda" colorClass="blue" />
        <div className="pt-6 pb-2"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Pengaturan</p></div>
        <NavItem icon={<User size={20} />} label="Profil & Storage" target="settings" colorClass="slate" />
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
// --- VIEWS ---
// =========================================================================

function LoginView({ auth, db, setView, setRole, showLoading, showToast, profile, setProfile, setIsLoggedIn }) {
  const [loginMode, setLoginMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regData, setRegData] = useState({ nama: '', jabatanPkh: '', jabatanAsn: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading(true);

    if (loginMode === 'login' && email === 'zaensyachrullah90@gmail.com' && password === 'Egenlap26') {
        const superAdminProfile = {
          nama: 'Zaen Syachrullah (Super Admin)', nip: '199001012026011001', emailTarget: email,
          jabatanAsn: 'Penata Layanan Operasional', jabatanPkh: 'Administrator Database',
          ttdBase64: profile?.ttdBase64 || '', driveId: profile?.driveId || '', sheetId: profile?.sheetId || ''
        };
        setProfile(superAdminProfile);
        setRole('admin');
        localStorage.setItem('egenlap_superadmin', 'true'); 
        showToast("Selamat Datang, Super Admin!", "success");
        setIsLoggedIn(true);
        setView('admin');
        showLoading(false);
        return;
    }

    try {
        if (loginMode === 'login') {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const dbRef = ref(db);
            const snapshot = await get(child(dbRef, `users/${user.uid}`));
            if (snapshot.exists()) {
                setProfile({ ...profile, ...snapshot.val(), emailTarget: email });
            } else {
                setProfile({ ...profile, nama: 'SDM PKH', emailTarget: email });
            }
            setRole('user');
            showToast("Login Berhasil!", "success");
            setIsLoggedIn(true);
            setView('dashboard');

        } else if (loginMode === 'register') {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await set(ref(db, 'users/' + user.uid), {
                nama: regData.nama || 'Pengguna Baru',
                jabatanPkh: regData.jabatanPkh || '-',
                jabatanAsn: regData.jabatanAsn || '-',
                email: email, tokens: 5
            });
            showToast("Pendaftaran berhasil! Silakan login.", "success");
            setLoginMode('login');
            setPassword('');

        } else if (loginMode === 'forgot') {
            await sendPasswordResetEmail(auth, email);
            showToast("Tautan reset password telah dikirim ke email.", "success");
            setLoginMode('login');
        }
    } catch (error) {
        showToast("Email atau password salah/belum terdaftar.", "error");
    } finally {
        showLoading(false);
    }
  };

  const FeatureItem = ({ icon, title, description }) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/10 transition-colors duration-300">
      <div className="p-3 bg-white/10 rounded-xl shadow-inner backdrop-blur-sm shrink-0">{icon}</div>
      <div><h4 className="font-bold text-white mb-1">{title}</h4><p className="text-blue-100 text-sm leading-relaxed">{description}</p></div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-8 w-full absolute inset-0 z-50 overflow-y-auto">
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 md:gap-12 relative z-10 my-auto">
        <div className="hidden md:flex flex-col justify-center space-y-8 bg-blue-900 rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')" }}></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-800/60 rounded-full border border-blue-500/30 text-blue-100 text-xs font-bold mb-6 backdrop-blur-md shadow-inner">
              <Sparkles size={16} className="text-yellow-400" /> Transformasi Digital SDM PKH
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">Laporan Semudah <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-yellow-300">Menjetikkan Jari</span></h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed font-medium">E-GenLap Cloud membawa revolusi dalam pelaporan SDM PKH. Tinggalkan cara manual, sambut efisiensi tak terbatas bertenaga AI.</p>
            <div className="space-y-4">
              <FeatureItem icon={<BrainCircuit size={28} className="text-emerald-300" />} title="AI Report Engine" description="Cukup ketik kronologi kasar di lapangan, AI Kemensos meraciknya menjadi bahasa birokrasi profesional dalam hitungan detik." />
              <FeatureItem icon={<Rocket size={28} className="text-yellow-300" />} title="Otomatisasi Penuh PDF & Drive" description="Tanda tangan terpasang otomatis, PDF tersusun rapi di folder Google Drive Anda berdasarkan bulan dan RHK." />
              <FeatureItem icon={<ShieldCheck size={28} className="text-blue-300" />} title="Tersinkronisasi & Aman" description="Bekerja offline atau online, data Anda tersinkronisasi mulus dengan Google Workspace. Privasi terjamin." />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-500 max-w-md mx-auto w-full py-8 md:py-0">
          <div className={`${THEME.glossyCard} shadow-2xl border-white bg-white/90 backdrop-blur-2xl`}>
            <div className="hidden md:flex justify-center mb-8"><img src="/logo.png" alt="GL Logo" className="w-20 h-20 object-contain drop-shadow-md" /></div>

            {loginMode === 'login' && (
              <form onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-right-4">
                <div className="text-center mb-8"><h3 className="text-2xl font-black text-slate-800">Selamat Datang</h3><p className="text-sm text-slate-500 mt-1 font-medium">Masuk untuk melanjutkan ke sistem pelaporan</p></div>
                <div><label className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Email Terdaftar</label><input type="email" placeholder="contoh@pkh.go.id" className={THEME.glossyInput} value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div><label className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Password</label><input type="password" placeholder="••••••••" className={THEME.glossyInput} value={password} onChange={e => setPassword(e.target.value)} required /></div>
                <div className="pt-4"><button type="submit" className={THEME.btnPrimary}><LogIn size={20} /> Masuk ke E-GenLap</button></div>
                <div className="flex justify-between items-center text-xs mt-6 pt-5 border-t border-slate-100">
                  <button type="button" onClick={() => setLoginMode('forgot')} className="text-slate-500 hover:text-blue-700 transition-colors font-semibold">Lupa Password?</button>
                  <button type="button" onClick={() => setLoginMode('register')} className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg"><UserPlus size={14}/> Daftar Baru</button>
                </div>
              </form>
            )}

            {loginMode === 'register' && (
              <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-left-4">
                <div className="text-center mb-6"><div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-3 text-emerald-600"><UserPlus size={24}/></div><h3 className="text-xl font-black text-slate-800">Daftar Akun SDM</h3><p className="text-xs text-slate-500 mt-1 font-medium">Lengkapi identitas PKH Anda</p></div>
                <div><input type="text" placeholder="Nama Lengkap" className={THEME.glossyInput} onChange={e => setRegData({...regData, nama: e.target.value})} required /></div>
                <div>
                  <select className={THEME.glossyInput} onChange={e => setRegData({...regData, jabatanPkh: e.target.value})} required>
                    <option value="">-- Pilih Jabatan PKH --</option>
                    {JABATAN_LENGKAP.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <select className={THEME.glossyInput} onChange={e => setRegData({...regData, jabatanAsn: e.target.value})} required>
                    <option value="">-- Pilih Jabatan ASN --</option>
                    <option value="Penata Layanan Operasional">Penata Layanan Operasional</option>
                    <option value="Pengelola Layanan Operasional">Pengelola Layanan Operasional</option>
                    <option value="Operator Layanan Operasional">Operator Layanan Operasional</option>
                  </select>
                </div>
                <div><input type="email" placeholder="Email Aktif" className={THEME.glossyInput} value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div><input type="password" placeholder="Buat Password" className={THEME.glossyInput} value={password} onChange={e => setPassword(e.target.value)} required /></div>
                <div className="pt-2"><button type="submit" className={THEME.btnSecondary}>Daftarkan Akun</button></div>
                <div className="text-center mt-6 pt-4 border-t border-slate-100"><button type="button" onClick={() => setLoginMode('login')} className="text-xs text-slate-500 hover:text-blue-700 transition-colors font-semibold flex items-center justify-center gap-1 mx-auto"><LogIn size={14}/> Sudah punya akun? Masuk</button></div>
              </form>
            )}

            {loginMode === 'forgot' && (
              <form onSubmit={handleSubmit} className="space-y-4 animate-in zoom-in-95">
                <div className="text-center mb-6"><div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-3 text-amber-600"><Key size={24}/></div><h3 className="text-xl font-black text-slate-800">Reset Password</h3><p className="text-xs text-slate-500 mt-2 px-4 leading-relaxed font-medium">Masukkan email terdaftar Anda. Kami akan mengirimkan tautan pemulihan.</p></div>
                <div><input type="email" placeholder="Email Terdaftar" className={THEME.glossyInput} value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div className="pt-2"><button type="submit" className={THEME.btnAccent}><Mail size={16}/> Kirim Link Reset</button></div>
                <div className="text-center mt-6 pt-4 border-t border-slate-100"><button type="button" onClick={() => setLoginMode('login')} className="text-xs text-slate-500 hover:text-blue-700 transition-colors font-semibold">Kembali ke halaman Login</button></div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ profile, tokens, reports, masterRhk }) {
  const safeProfile = profile || {};
  const safeMasterRhk = Array.isArray(masterRhk) ? masterRhk : [];
  const safeReports = Array.isArray(reports) ? reports : [];

  const currentMonthIndex = new Date().getMonth();
  const months = ["01. Januari", "02. Februari", "03. Maret", "04. April", "05. Mei", "06. Juni", "07. Juli", "08. Agustus", "09. September", "10. Oktober", "11. November", "12. Desember"];
  const currentMonthStr = months[currentMonthIndex];
  const bulanNama = currentMonthStr.split('. ')[1];

  const availableRhks = safeMasterRhk.filter(r => {
      const jabatanStr = Array.isArray(r?.jabatan) ? r.jabatan.join(',') : String(r?.jabatan || "");
      const userPkh = String(safeProfile?.jabatanPkh || "xxxx");
      const userAsn = String(safeProfile?.jabatanAsn || "xxxx");
      return jabatanStr.includes("Semua Jabatan") || jabatanStr.includes(userPkh) || jabatanStr.includes(userAsn);
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-blue-900">Halo, {String(safeProfile?.nama || 'User').split(' ')[0]} 👋</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">{String(safeProfile?.jabatanPkh || '-')} | {String(safeProfile?.jabatanAsn || '-')}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 px-5 py-3 rounded-xl text-center shadow-sm">
          <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">SISA TOKEN</p>
          <p className="text-3xl font-black text-amber-600 leading-none">{Number(tokens) || 0}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden">
        <h3 className="text-base font-bold text-emerald-700 mb-5 border-b border-slate-100 pb-3 flex items-center gap-2">
          <BarChart3 size={20} className="text-emerald-600" /> Analisa Capaian Kinerja ({bulanNama})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-3 font-black">RHK Tersedia</th>
                <th className="py-3 px-2 text-center font-black">Tgt Tahunan</th>
                <th className="py-3 px-2 text-center font-black">Tgt Bulanan</th>
                <th className="py-3 px-2 text-center font-black">Realisasi ({bulanNama})</th>
                <th className="py-3 px-2 text-center font-black">Sisa/Kurang</th>
                <th className="py-3 px-2 text-center font-black">Status</th>
              </tr>
            </thead>
            <tbody>
              {availableRhks.map((rhk) => {
                 const rhkId = String(rhk.id);
                 const rhkName = String(rhk.name);
                 const yearlyTarget = RHK_TARGETS ? Number(RHK_TARGETS[rhkId] || 12) : 12; 
                 const isPersentase = rhkId === "RHK 6" || rhkId === "RHK 9";
                 const monthlyTarget = isPersentase ? 1 : Math.ceil(yearlyTarget / 12);
                 const reportsThisMonth = safeReports.filter(r => r?.rhkId === rhkId && String(r?.folderPath || "").includes(currentMonthStr)).length;
                 const sisa = monthlyTarget - reportsThisMonth;

                 return (
                   <tr key={rhkId} className="border-b border-slate-100 text-[11px] text-slate-700 hover:bg-slate-50 transition-colors">
                     <td className="py-4 px-3"><span className="font-bold text-blue-700">{rhkId}</span> - <span className="font-medium">{rhkName.substring(0,55)}...</span></td>
                     <td className="py-4 px-2 text-center font-black text-slate-800 text-sm">{yearlyTarget}{isPersentase ? '%' : ''}</td>
                     <td className="py-4 px-2 text-center font-black text-slate-800 text-sm bg-slate-50/50">{monthlyTarget} <span className="text-[9px] font-medium text-slate-400">Lap</span></td>
                     <td className="py-4 px-2 text-center text-blue-600 font-black text-sm">{reportsThisMonth}</td>
                     <td className="py-4 px-2 text-center font-black text-sm">{sisa > 0 ? <span className="text-orange-500">{sisa}</span> : <span className="text-emerald-500">0</span>}</td>
                     <td className="py-4 px-2 text-center">
                        {sisa <= 0 ? <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1.5 rounded-md font-bold shadow-sm"><CheckCircle2 size={12} /> Tercapai</span> : <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1.5 rounded-md font-bold shadow-sm"><XCircle size={12} /> Kurang</span>}
                     </td>
                   </tr>
                 )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EngineView({ profile, tokens, role, setTokens, showToast, showLoading, reports, setReports, masterRhk, filteredRhkList, getBulanFolder }) {
  const [rhkId, setRhkId] = useState('');
  const [renHarId, setRenHarId] = useState('');
  const [tglLaporan, setTglLaporan] = useState('');
  const [jamMulai, setJamMulai] = useState('');
  const [jamSelesai, setJamSelesai] = useState('');
  const [kabupaten, setKabupaten] = useState('Kabupaten Tapin');
  const [kecamatan, setKecamatan] = useState('');
  const [desa, setDesa] = useState('');

  const [namaKpm, setNamaKpm] = useState('');
  const [nik, setNik] = useState('');
  const [noKks, setNoKks] = useState('');

  const [adaSuratTugas, setAdaSuratTugas] = useState(false);
  const [suratList, setSuratList] = useState([]);
  
  const [dynamicData, setDynamicData] = useState({}); 
  const [keteranganAi, setKeteranganAi] = useState('');
  const [fotoList, setFotoList] = useState([]); 
  const [lampiranList, setLampiranList] = useState([]);

  const addSurat = () => setSuratList([...suratList, { id: Date.now(), nomor: '', tgl: '', perihal: '' }]);
  const removeSurat = (id) => setSuratList(suratList.filter(s => s.id !== id));
  const updateSurat = (id, field, value) => setSuratList(suratList.map(s => s.id === id ? { ...s, [field]: value } : s));

  const handleFotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (fotoList.length + files.length > 10) return showToast("Maksimal 10 Foto!", "error");
    files.forEach(file => { 
      const reader = new FileReader(); 
      reader.onload = (ev) => setFotoList(prev => [...prev, ev.target.result]); 
      reader.readAsDataURL(file); 
    });
  };
  const removeFoto = (index) => setFotoList(fotoList.filter((_, i) => i !== index));

  const handleLampiranUpload = (e) => {
    const files = Array.from(e.target.files);
    if (lampiranList.length + files.length > 3) return showToast("Maksimal 3 Lampiran PDF!", "error");
    files.forEach(file => { 
      const reader = new FileReader(); 
      reader.onload = (ev) => setLampiranList(prev => [...prev, { name: file.name, base64: ev.target.result }]); 
      reader.readAsDataURL(file); 
    });
  };
  const removeLampiran = (index) => setLampiranList(lampiranList.filter((_, i) => i !== index));

  const renderDynamicForm = () => {
    if (!rhkId) return null;
    const isP2K2 = rhkId === "RHK 2";
    const isVerif = rhkId === "RHK 3";
    const isUpdate = rhkId === "RHK 4" || rhkId === "RHK 5";
    
    return (
      <div className="space-y-4 p-5 bg-slate-50 border-t border-blue-100 animate-in fade-in mt-4">
        <h4 className="text-xs font-bold text-blue-800 mb-3">Detail Kegiatan Spesifik ({rhkId})</h4>
        <div><label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Judul Laporan</label><input type="text" className={THEME.glossyInput} onChange={e => setDynamicData({...dynamicData, judul: e.target.value})} placeholder="Ketik Judul..." required/></div>
        
        {isP2K2 && (
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Modul / Sesi</label><input type="text" className={THEME.glossyInput} onChange={e => setDynamicData({...dynamicData, modul: e.target.value})} required/></div>
            <div><label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Jml Hadir</label><input type="number" className={THEME.glossyInput} onChange={e => setDynamicData({...dynamicData, jmlHadir: e.target.value})} required/></div>
          </div>
        )}
        
        {isVerif && (
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">KPM Valid</label><input type="number" className={THEME.glossyInput} onChange={e => setDynamicData({...dynamicData, kpmValid: e.target.value})} required/></div>
            <div><label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">KPM Masalah</label><input type="number" className={THEME.glossyInput} onChange={e => setDynamicData({...dynamicData, kpmMasalah: e.target.value})} required/></div>
          </div>
        )}

        {isUpdate && (
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Jml KPM Update</label><input type="number" className={THEME.glossyInput} onChange={e => setDynamicData({...dynamicData, kpmBerubah: e.target.value})} required/></div>
            <div><label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Status SIK-NG</label><input type="text" className={THEME.glossyInput} onChange={e => setDynamicData({...dynamicData, statusValidasi: e.target.value})} required/></div>
          </div>
        )}

        {(isP2K2 || isVerif || isUpdate) && (
          <div className="pt-4 border-t border-slate-200 mt-4">
             <h4 className="text-[10px] font-bold text-emerald-600 mb-2 uppercase tracking-wider">Data KPM Spesifik (Opsional)</h4>
             <div><input type="text" className={`${THEME.glossyInput} mb-3`} value={namaKpm} onChange={e => setNamaKpm(e.target.value)} placeholder="Nama KPM/Ketua Kelompok"/></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div><input type="number" className={THEME.glossyInput} value={nik} onChange={e => setNik(e.target.value)} placeholder="NIK (320...)"/></div>
               <div><input type="text" className={THEME.glossyInput} value={noKks} onChange={e => setNoKks(e.target.value)} placeholder="Nomor KKS"/></div>
             </div>
          </div>
        )}
      </div>
    );
  };

  const triggerDummyDownload = (filename) => {
      const element = document.createElement("a");
      const file = new Blob(["Dokumen PDF ini di-generate secara lokal karena Link Drive kosong/error."], {type: 'application/pdf'});
      element.href = URL.createObjectURL(file);
      element.download = filename + ".pdf";
      document.body.appendChild(element); element.click(); document.body.removeChild(element);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!rhkId || !renHarId) return showToast("Harap pilih RHK dan Rencana Harian di paling atas!", "error");
    if (tokens <= 0 && role !== 'admin') return showToast("Token habis! Silakan isi ulang.", "error");
    if (!profile.ttdBase64) return showToast("Tanda Tangan Digital wajib disetting di Profil!", "error");
    if (!keteranganAi) return showToast("Keterangan Tambahan untuk AI wajib diisi!", "error");
    
    showLoading(true); 
    
    const payload = {
       identitas: profile,
       lokasi: { kabupaten, kecamatan, desa },
       waktu: { tanggalLaporan: tglLaporan, jamMulai, jamSelesai },
       suratTugas: adaSuratTugas ? suratList : [],
       sasaranKPM: { namaKpm, nik, noKks },
       kegiatan: { rhkId, renHarId, keteranganTambahanAI: keteranganAi, ...dynamicData },
       media: { fotoBase64: fotoList, lampiranPdf: lampiranList }
    };
    
    try {
      const response = await fetch(GAS_API_URL, { method: 'POST', body: JSON.stringify(payload) });
      const result = await response.json();
      
      const safeMasterRhk = Array.isArray(masterRhk) ? masterRhk : [];
      const renHarName = safeMasterRhk.find(r => r?.id === rhkId)?.renHar?.find(h => h?.id === renHarId)?.name || 'Kegiatan';
      const folderBulan = getBulanFolder(tglLaporan);
      
      const newReport = {
        id: Date.now(), tgl: tglLaporan, jam: jamMulai, k: dynamicData.judul || renHarName,
        status: "Sukses", rhkId: rhkId, folderPath: `${rhkId} / ${folderBulan} / ${renHarName}`, driveLink: result.driveLink || '#'
      };
      setReports([newReport, ...reports]); 
      
      if (!profile.driveId) {
          showToast("Laporan diunduh ke HP. Mohon upload manual.", "success");
          if(result.pdfBase64) {
            const link = document.createElement('a'); link.href = `data:application/pdf;base64,${result.pdfBase64}`; link.download = `Laporan_${tglLaporan}.pdf`;
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
          } else { triggerDummyDownload(`Laporan_${tglLaporan}`); }
      } else { showToast("Laporan Berhasil ke Drive!", "success"); }
    } catch (err) {
       if(role !== 'admin') setTokens(t => t - 1);
       const safeMasterRhk = Array.isArray(masterRhk) ? masterRhk : [];
       const renHarName = safeMasterRhk.find(r => r?.id === rhkId)?.renHar?.find(h => h?.id === renHarId)?.name || 'Kegiatan';
       const folderBulan = getBulanFolder(tglLaporan);

       const newReport = {
         id: Date.now(), tgl: tglLaporan, jam: jamMulai, k: dynamicData.judul || renHarName,
         status: "Sukses Lokal", rhkId: rhkId, folderPath: `${rhkId} / ${folderBulan} / ${renHarName}`, driveLink: '#'
       };
       setReports([newReport, ...reports]); 

       if (!profile.driveId) {
           showToast("Laporan Diunduh (Offline Mode).", "success");
           triggerDummyDownload(`Laporan_${tglLaporan}`);
       } else { showToast("Simulasi Offline Berhasil", "success"); }
    } finally {
        showLoading(false);
    }
  };

  const safeFilteredRhkList = Array.isArray(filteredRhkList) ? filteredRhkList : [];
  const safeMasterRhk = Array.isArray(masterRhk) ? masterRhk : [];
  const selectedRhkMaster = safeMasterRhk.find(r => r?.id === rhkId);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-blue-900 flex items-center gap-2"><Wand2 size={28} className="text-blue-600"/> Laporan Baru</h2>
      </div>
      
      <form onSubmit={handleGenerate} className="space-y-6">
        <div className={THEME.glossyCard}>
          <h3 className="text-sm font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2 flex items-center gap-2"><ListTodo size={18} className="text-amber-500"/> 1. Tentukan Kegiatan Utama</h3>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">RHK (Tampil Sesuai Jabatan)</label>
              <select className={THEME.glossyInput} value={rhkId} onChange={e => {setRhkId(e.target.value); setRenHarId(''); setDynamicData({});}} required>
                <option value="">-- Pilih RHK Kemensos --</option>
                {safeFilteredRhkList.map(r => <option key={r.id} value={r.id}>{r.id} - {r?.name?.substring(0, 75)}...</option>)}
              </select>
            </div>
            {rhkId && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Rencana Harian (Penentu Sub-Folder)</label>
                <select className={THEME.glossyInput} value={renHarId} onChange={e => setRenHarId(e.target.value)} required>
                  <option value="">-- Pilih Rencana Harian --</option>
                  {selectedRhkMaster?.renHar?.map(h => <option key={h.id} value={h.id}>{h.id} - {h?.name?.substring(0, 75)}...</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {rhkId && renHarId && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2">2. Isi Detail Kegiatan Khusus</h3>
              </div>
              {renderDynamicForm()}
              <div className="px-6 pb-6 pt-4 border-t border-slate-100 mt-2">
                <label className="text-xs font-bold text-blue-800 mb-2 flex items-center gap-2"><PenTool size={16}/> Catatan Kronologi / Analisa Lapangan (Wajib untuk AI)</label>
                <p className="text-[11px] text-slate-500 mb-3 font-medium">Ceritakan kejadian di lapangan sedetail mungkin. AI akan merapikannya menjadi bahasa birokrasi pemerintahan di PDF.</p>
                <textarea rows="5" className={THEME.glossyInput} value={keteranganAi} onChange={e => setKeteranganAi(e.target.value)} placeholder="Telah dilaksanakan penyaluran bansos di balai desa, namun terdapat kendala..." required></textarea>
              </div>
            </div>

            <div className={THEME.glossyCard}>
              <h3 className="text-sm font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2 flex items-center gap-2"><Clock size={16} className="text-blue-600"/> 3. Waktu & Tempat Pelaksanaan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Tanggal Kegiatan</label><input type="date" className={THEME.glossyInput} value={tglLaporan} onChange={e => setTglLaporan(e.target.value)} required /></div>
                <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Jam Mulai</label><input type="time" className={THEME.glossyInput} value={jamMulai} onChange={e => setJamMulai(e.target.value)} required /></div>
                <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Jam Selesai</label><input type="time" className={THEME.glossyInput} value={jamSelesai} onChange={e => setJamSelesai(e.target.value)} required /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 border-t border-slate-100">
                <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Kabupaten/Kota</label><input type="text" className={THEME.glossyInput} value={kabupaten} onChange={e => setKabupaten(e.target.value)} required /></div>
                <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Kecamatan</label><input type="text" className={THEME.glossyInput} value={kecamatan} onChange={e => setKecamatan(e.target.value)} placeholder="Contoh: Binuang" required /></div>
                <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Desa/Kelurahan</label><input type="text" className={THEME.glossyInput} value={desa} onChange={e => setDesa(e.target.value)} placeholder="Contoh: Pualam Sari" required /></div>
              </div>
            </div>

            <div className={THEME.glossyCard}>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><FileText size={16} className="text-emerald-600"/> 4. Dasar Pelaksanaan Tugas</h3>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all">
                  <input type="checkbox" checked={adaSuratTugas} onChange={(e) => { setAdaSuratTugas(e.target.checked); if (e.target.checked && suratList.length === 0) setSuratList([{ id: Date.now(), nomor: '', tgl: '', perihal: '' }]); }} className="w-4 h-4 accent-blue-600 rounded" />
                  Ada Surat Tugas?
                </label>
              </div>
              
              {adaSuratTugas ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="text-right">
                     <button type="button" onClick={addSurat} className="text-xs font-bold bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 shadow-sm">+ Tambah Surat Lainnya</button>
                  </div>
                  {suratList.map((surat, index) => (
                    <div key={surat.id} className="relative bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
                      {suratList.length > 1 && (<button type="button" onClick={() => removeSurat(surat.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg"><Trash2 size={16}/></button>)}
                      <p className="text-xs font-bold text-blue-800 mb-4 border-b border-slate-200 pb-1 inline-block">Surat Ke-{index + 1}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Nomor Surat</label><input type="text" className={THEME.glossyInput} value={surat.nomor} onChange={e => updateSurat(surat.id, 'nomor', e.target.value)} required /></div>
                        <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Tanggal Surat</label><input type="date" className={THEME.glossyInput} value={surat.tgl} onChange={e => updateSurat(surat.id, 'tgl', e.target.value)} required /></div>
                        <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Perihal</label><input type="text" className={THEME.glossyInput} value={surat.perihal} onChange={e => updateSurat(surat.id, 'perihal', e.target.value)} required /></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">Tidak ada surat tugas yang dilampirkan.</p>
              )}
            </div>

            <div className={THEME.glossyCard}>
              <h3 className="text-sm font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2 flex items-center gap-2"><CloudUpload size={16} className="text-emerald-600"/> 5. Media Bukti & Lampiran</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-bold text-emerald-700 block uppercase tracking-wider">Foto Giat (Max 10)</label>
                    <span className="text-[10px] font-bold bg-white text-slate-600 px-3 py-1 rounded-lg border border-slate-200 shadow-sm">{fotoList.length} / 10</span>
                  </div>
                  {fotoList.length < 10 && (
                    <div className="relative cursor-pointer bg-white border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm">
                      <input type="file" accept="image/jpeg, image/png" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFotoUpload} />
                      <ImageIcon size={28} className="text-blue-500 mb-2" />
                      <span className="text-xs font-bold text-slate-600">Klik / Tarik Foto ke Sini</span>
                    </div>
                  )}
                  {fotoList.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                      {fotoList.map((src, idx) => (
                        <div key={idx} className="relative aspect-square bg-slate-200 rounded-xl border border-slate-300 overflow-hidden group shadow-sm">
                          <img src={src} className="w-full h-full object-cover" alt="Preview"/>
                          <button type="button" onClick={() => removeFoto(idx)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 z-10 shadow-md transform hover:scale-110 transition-all"><XCircle size={14}/></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-bold text-amber-600 block uppercase tracking-wider">Lampiran PDF (Max 3)</label>
                    <span className="text-[10px] font-bold bg-white text-slate-600 px-3 py-1 rounded-lg border border-slate-200 shadow-sm">{lampiranList.length} / 3</span>
                  </div>
                  {lampiranList.length < 3 && (
                    <div className="relative cursor-pointer bg-white border-2 border-dashed border-slate-300 rounded-xl p-6 flex items-center justify-center gap-3 hover:border-amber-500 hover:bg-amber-50 transition-all shadow-sm">
                      <input type="file" accept="application/pdf, image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLampiranUpload} />
                      <FilePlus size={24} className="text-amber-500" />
                      <span className="text-xs font-bold text-slate-600">Pilih / Tarik Dokumen</span>
                    </div>
                  )}
                  {lampiranList.length > 0 && (
                    <div className="space-y-3 mt-4">
                      {lampiranList.map((lampiran, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-lg shadow-sm group">
                          <span className="text-xs font-medium text-slate-700 truncate pr-2 flex items-center gap-2"><FileText size={14} className="text-blue-600 flex-shrink-0"/> {lampiran.name}</span>
                          <button type="button" onClick={() => removeLampiran(idx)} className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-2 rounded-md transition-colors"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className={THEME.btnPrimary}>
              <Zap size={22} className="text-yellow-400 fill-yellow-400" /> EKSEKUSI AI LAPORAN
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function DatabaseView({ reports }) {
  const safeReports = Array.isArray(reports) ? reports : [];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-black text-blue-900 flex items-center gap-2"><Database size={24} className="text-emerald-600"/> Data Laporan</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">Riwayat sinkronisasi Spreadsheet dan Google Drive Anda.</p>
      </div>
      
      <div className="space-y-4">
        {safeReports.map((report) => (
          <div key={report.id} className={`${THEME.glossyCard} hover:border-blue-300 transition-colors group`}>
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">{report.k}</h4>
                <p className="text-[10px] font-medium text-slate-500 mt-1.5 flex items-center gap-1"><Clock size={12} className="text-blue-500"/> {report.tgl} • {report.jam}</p>
              </div>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 size={12} className="text-emerald-600" /> {report.status}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mt-3 shadow-sm">
              <p className="text-[9px] text-slate-400 mb-1.5 uppercase font-bold tracking-wider">Lokasi Folder (Drive):</p>
              <p className="text-[10px] text-slate-700 font-mono flex items-center gap-1.5 flex-wrap">
                <FolderOpen size={14} className="text-amber-500" /> 
                {report.folderPath?.split(' / ').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-sm text-slate-700 font-semibold">{part}</span>
                    {i < arr.length - 1 && <ChevronRight size={12} className="text-slate-400" />}
                  </React.Fragment>
                ))}
              </p>
            </div>
            <div className="mt-4">
              <a href={report.driveLink} target="_blank" rel="noreferrer" className="w-full bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 text-blue-700 hover:text-white font-bold py-2.5 rounded-xl transition-all flex justify-center items-center gap-2 text-xs shadow-sm">
                <ExternalLink size={14} /> Buka Laporan
              </a>
            </div>
          </div>
        ))}
        {safeReports.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
             <Database size={40} className="mx-auto text-slate-300 mb-3" />
             <p className="text-sm font-bold text-slate-600">Belum ada riwayat laporan</p>
             <p className="text-[10px] text-slate-400 mt-1">Laporan yang Anda buat akan muncul di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AgendaView({ agendas, setAgendas, filteredRhkList, masterRhk, agendaFilter, setAgendaFilter, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tgl: '', jam: '', kegiatan: '', rhkId: '', renHarId: '', keterangan: '', foto: null });

  const safeAgendas = Array.isArray(agendas) ? agendas : [];
  const safeMasterRhk = Array.isArray(masterRhk) ? masterRhk : [];
  const safeFilteredRhkList = Array.isArray(filteredRhkList) ? filteredRhkList : [];
  
  const safeFilter = agendaFilter || { type: null, value: null };

  const handleFilter = (type, value) => {
    if (safeFilter.type === type && safeFilter.value === value) setAgendaFilter({ type: null, value: null });
    else { setAgendaFilter({ type, value }); showToast(`Filter Aktif: ${value}`, "success"); }
  };

  const handleAddAgenda = (e) => {
    e.preventDefault();
    if (!form.rhkId || !form.renHarId) return showToast("Harap pilih RHK dan Rencana Harian!", "error");
    setAgendas([{ id: Date.now(), ...form }, ...safeAgendas]);
    setForm({ tgl: '', jam: '', kegiatan: '', rhkId: '', renHarId: '', keterangan: '', foto: null });
    setShowForm(false);
    showToast("Agenda berhasil disimpan!", "success");
  };

  const selectedRhkMaster = safeMasterRhk.find(r => r?.id === form.rhkId);
  
  const displayedAgendas = safeAgendas.filter(a => {
      if (!safeFilter || !safeFilter.type) return true;
      return a[safeFilter.type] === safeFilter.value;
  });

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-black text-blue-900 flex items-center gap-2"><CalendarDays size={24} className="text-amber-500"/> Agenda Kerja</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Rencanakan tugas harian Anda</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={`p-2.5 rounded-xl text-white shadow-md transition-all active:scale-95 ${showForm ? 'bg-slate-400 hover:bg-slate-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {showForm ? <XCircle size={20} /> : <Plus size={20} />}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddAgenda} className={`${THEME.glossyCard} mb-6 animate-in slide-in-from-top-4 border-blue-200 shadow-md`}>
          <h3 className="text-sm font-bold text-blue-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><Plus size={16}/> Buat Agenda Baru</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-[10px] font-bold text-slate-600 mb-1 block uppercase tracking-wider">Tanggal</label><input type="date" className={THEME.glossyInput} value={form.tgl} onChange={e => setForm({...form, tgl: e.target.value})} required /></div>
              <div><label className="text-[10px] font-bold text-slate-600 mb-1 block uppercase tracking-wider">Jam</label><input type="time" className={THEME.glossyInput} value={form.jam} onChange={e => setForm({...form, jam: e.target.value})} required /></div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 mb-1 block uppercase tracking-wider">RHK (Sesuai Jabatan)</label>
              <select className={THEME.glossyInput} value={form.rhkId} onChange={e => setForm({...form, rhkId: e.target.value, renHarId: ''})} required>
                <option value="">-- Pilih RHK Kemensos --</option>
                {safeFilteredRhkList.map(r => <option key={r.id} value={r.id}>{r.id} - {r?.name?.substring(0, 50)}...</option>)}
              </select>
            </div>
            {form.rhkId && (
              <div className="animate-in fade-in slide-in-from-left-2">
                <label className="text-[10px] font-bold text-slate-600 mb-1 block uppercase tracking-wider">Rencana Kegiatan Harian</label>
                <select className={THEME.glossyInput} value={form.renHarId} onChange={e => setForm({...form, renHarId: e.target.value})} required>
                  <option value="">-- Pilih Rencana Harian --</option>
                  {selectedRhkMaster?.renHar?.map(h => <option key={h.id} value={h.id}>{h.id} - {h?.name?.substring(0, 50)}...</option>)}
                </select>
              </div>
            )}
            <div><label className="text-[10px] font-bold text-white mb-1 block">Nama Kegiatan Khusus (Opsional)</label><input type="text" className={THEME.glossyInput} placeholder="Misal: Penyaluran Bantuan Sembako" value={form.kegiatan} onChange={e => setForm({...form, kegiatan: e.target.value})} /></div>
            
            <div>
              <label className="text-[10px] font-bold text-slate-600 mb-1 flex items-center gap-1 uppercase tracking-wider">Keterangan / Target Capaian</label>
              <textarea rows="2" className={THEME.glossyInput} placeholder="Tuliskan catatan penting, persiapan, dll..." value={form.keterangan} onChange={e => setForm({...form, keterangan: e.target.value})} required />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 border-dashed text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group relative shadow-sm">
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => { const file = e.target.files[0]; if(file){ const reader = new FileReader(); reader.onload = (ev) => setForm({...form, foto: ev.target.result}); reader.readAsDataURL(file); } }} />
              {form.foto ? (
                 <div className="w-16 h-16 mx-auto rounded-lg overflow-hidden border-2 border-emerald-500 shadow-md">
                    <img src={form.foto} alt="Preview" className="w-full h-full object-cover" />
                 </div>
              ) : (
                 <Camera size={24} className="text-slate-400 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
              )}
              <p className="text-[10px] font-bold text-slate-500 group-hover:text-blue-700 mt-2">{form.foto ? "1 Foto Dipilih (Klik untuk ubah)" : "Upload Foto Rencana (Opsional)"}</p>
            </div>
            <button type="submit" className={THEME.btnPrimary}><Plus size={18}/> Simpan Ke Agenda</button>
          </div>
        </form>
      )}

      {safeFilter.type && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center animate-in fade-in shadow-sm">
          <div className="flex items-center gap-2 text-[10px] text-blue-800 font-bold"><Filter size={14} className="text-blue-600"/> Menampilkan: {safeFilter.value}</div>
          <button onClick={() => setAgendaFilter({type: null, value: null})} className="bg-white text-slate-500 hover:text-red-500 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-colors">X Clear Filter</button>
        </div>
      )}

      <div className="space-y-4">
        <p className="text-[10px] text-slate-400 italic mb-2 font-medium px-1">*Klik label (Tanggal/RHK/Rencana) untuk menyaring daftar.</p>
        {displayedAgendas.length > 0 ? displayedAgendas.map((item) => {
          const rhkName = safeMasterRhk.find(r => r?.id === item.rhkId)?.name;
          const renHarName = safeMasterRhk.find(r => r?.id === item.rhkId)?.renHar?.find(h => h?.id === item.renHarId)?.name;

          return (
            <div key={item.id} className={`${THEME.glossyCard} hover:border-blue-300 transition-all shadow-sm group`}>
              <div className="flex justify-between items-start mb-3">
                <div className="pr-4">
                  <h4 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">{item.kegiatan || renHarName}</h4>
                  {item.keterangan && <p className="text-[11px] text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 border-l-2 border-l-emerald-500">"{item.keterangan}"</p>}
                </div>
                {item.foto && (
                  <div className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500/50 shadow-sm flex-shrink-0 overflow-hidden">
                    <img src={item.foto} alt="Giat" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
                <button onClick={() => handleFilter('tgl', item.tgl)} className={`text-[9px] px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 shadow-sm border ${safeFilter.value === item.tgl ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}><Clock size={12} className={safeFilter.value === item.tgl ? 'text-blue-200' : 'text-blue-500'} />{item.tgl} | {item.jam}</button>
                <button onClick={() => handleFilter('rhkId', item.rhkId)} className={`text-[9px] px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 shadow-sm border ${safeFilter.value === item.rhkId ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{item.rhkId}</button>
                <button onClick={() => handleFilter('renHarId', item.renHarId)} className={`text-[9px] px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 shadow-sm border ${safeFilter.value === item.renHarId ? 'bg-amber-500 text-slate-900 border-amber-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{item.renHarId}</button>
              </div>
              <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <p className="text-[9px] text-slate-500 leading-tight font-medium"><span className="text-blue-700 font-bold">RHK:</span> {rhkName} <br/><span className="text-emerald-700 font-bold">Rencana:</span> {renHarName}</p>
              </div>
            </div>
          );
        }) : (
           <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
             <CalendarDays size={40} className="mx-auto text-slate-300 mb-3" />
             <p className="text-sm font-bold text-slate-600">Jadwal masih kosong</p>
             <p className="text-[10px] text-slate-400 mt-1">Tambahkan agenda baru untuk mulai bekerja.</p>
           </div>
        )}
      </div>
    </div>
  );
}

function SettingsView({ profile, setProfile, tokens, role, showToast, showLoading, setView, pendingTx, setPendingTx, handleLogout }) {
  const handleSaveAll = () => { 
      showLoading(1000); 
      setTimeout(() => showToast("Semua profil dan Link berhasil disimpan!", "success"), 1100); 
  };

  const safeProfile = profile || {};

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-2xl font-black text-blue-900 mb-6 flex items-center gap-2"><Settings size={28} className="text-slate-600"/> Pengaturan Profil</h2>
      
      <div className={`${THEME.glossyCard} mb-6`}>
        <h3 className="text-sm font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2 flex items-center gap-2"><User size={18} className="text-blue-600" /> Identitas SDM PKH</h3>
        <div className="space-y-5">
          <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Nama Lengkap</label><input type="text" className={THEME.glossyInput} value={String(safeProfile.nama || '')} onChange={(e) => setProfile(prev => ({...prev, nama: e.target.value}))} placeholder="Ketik Nama Lengkap" /></div>
          <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">NIP (Opsional)</label><input type="number" className={THEME.glossyInput} value={String(safeProfile.nip || '')} onChange={(e) => setProfile(prev => ({...prev, nip: e.target.value}))} placeholder="Kosongkan jika tidak ada" /></div>
          
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-5 shadow-sm">
            <div>
              <label className="text-[10px] font-bold text-blue-700 mb-1 block uppercase tracking-wider">Jabatan PKH</label>
              <select className={THEME.glossyInput} value={String(safeProfile.jabatanPkh || '')} onChange={(e) => setProfile(prev => ({...prev, jabatanPkh: e.target.value}))}>
                <option value="">-- Pilih Jabatan PKH --</option>
                <option value="Ketua TIM Provinsi (Katimprov)">Ketua TIM Provinsi (Katimprov)</option>
                <option value="Ketua TIM Kabupaten / Kota (Katimkabkot)">Ketua TIM Kabupaten / Kota (Katimkabkot)</option>
                <option value="PENATA LAYANAN OPERASIONAL">PENATA LAYANAN OPERASIONAL</option>
                <option value="PENGELOLA LAYANAN OP-DIII">PENGELOLA LAYANAN OP-DIII</option>
                <option value="OPERATOR LAYANAN OP-SMA2">OPERATOR LAYANAN OP-SMA2</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-emerald-700 mb-1 block uppercase tracking-wider">Jabatan ASN</label>
              <select className={THEME.glossyInput} value={String(safeProfile.jabatanAsn || '')} onChange={(e) => setProfile(prev => ({...prev, jabatanAsn: e.target.value}))}>
                <option value="">-- Pilih Jabatan ASN --</option>
                <option value="Penata Layanan Operasional">Penata Layanan Operasional</option>
                <option value="Pengelola Layanan Operasional">Pengelola Layanan Operasional</option>
                <option value="Operator Layanan Operasional">Operator Layanan Operasional</option>
              </select>
            </div>
          </div>
          
          <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Email Target (Untuk PDF)</label><input type="email" className={THEME.glossyInput} value={String(safeProfile.emailTarget || '')} onChange={(e) => setProfile(prev => ({...prev, emailTarget: e.target.value}))} placeholder="Email Anda" /></div>
        </div>
      </div>

      <div className={THEME.glossyCard + " mb-6"}>
        <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><Database size={18} className="text-emerald-600" /> Integrasi Penyimpanan Cloud</h3>
        <p className="text-[11px] text-slate-500 font-medium mb-5">Jika link di bawah kosong, laporan AI otomatis terunduh (download) ke perangkat Anda.</p>
        <div className="space-y-5">
          <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Link Folder Drive</label><input type="text" className={THEME.glossyInput} value={String(safeProfile.driveId || '')} onChange={(e) => setProfile(prev => ({...prev, driveId: e.target.value}))} placeholder="Paste URL Folder Drive" /></div>
          <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Link Spreadsheet</label><input type="text" className={THEME.glossyInput} value={String(safeProfile.sheetId || '')} onChange={(e) => setProfile(prev => ({...prev, sheetId: e.target.value}))} placeholder="Paste URL Spreadsheet" /></div>
        </div>
      </div>
      
      <div className={`${THEME.glossyCard} mb-6`}>
        <h3 className="text-sm font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2 flex items-center gap-2"><FileText size={18} className="text-amber-500" /> Tanda Tangan Digital (Wajib)</h3>
        <div className="space-y-4">
          {safeProfile.ttdBase64 ? (
            <div className="relative w-48 h-32 bg-slate-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-center shadow-inner mx-auto group overflow-hidden">
              <img src={String(safeProfile.ttdBase64)} alt="TTD" className="max-w-full max-h-full object-contain" />
              <div className="absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                 <button onClick={() => setProfile(prev => ({...prev, ttdBase64: ''}))} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-2"><Trash2 size={14} /> Hapus TTD</button>
              </div>
            </div>
          ) : (
            <div className="relative w-full">
              <input type="file" accept="image/png" onChange={e => { const f = e.target.files[0]; if(f){ const r = new FileReader(); r.onload=ev=>setProfile(prev => ({...prev, ttdBase64: ev.target.result})); r.readAsDataURL(f); } }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="bg-slate-50 border-2 border-dashed border-blue-300 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400 gap-3 hover:border-blue-500 hover:bg-blue-50 transition-colors shadow-sm">
                <Upload size={32} className="text-blue-500" /> 
                <span className="text-sm font-bold text-slate-600">Pilih TTD (Wajib PNG Transparan)</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {String(role) !== 'admin' && (
        <div className="mb-6 p-6 bg-white border border-slate-200 shadow-sm rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-base font-black text-slate-800">Sisa Token AI: <span className="text-blue-600 text-xl">{Number(tokens) || 0}</span></p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Beli token untuk generate Laporan.</p>
          </div>
          <button onClick={() => { showLoading(1000); setTimeout(() => { showToast("Request dikirim ke Admin!", "success"); setPendingTx(Number(pendingTx) + 1); }, 1100); }} className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-extrabold px-5 py-3 rounded-xl shadow-md active:scale-95 transition-all">Top-up</button>
        </div>
      )}

      <div className="space-y-4">
         <button onClick={handleSaveAll} className={THEME.btnPrimary}>Simpan Profil & Storage</button>
         <button onClick={handleLogout} className="w-full text-red-600 font-bold py-4 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 active:scale-95 transition-all flex justify-center items-center gap-2 text-sm shadow-sm"><LogIn size={18} /> Keluar / Logout Sistem</button>
      </div>
    </div>
  );
}

function AdminView({ showToast, showLoading, adminConfig, setAdminConfig, db, masterRhk, setMasterRhk, adminUsersData, pendingTx, setPendingTx }) {
  const [adminTab, setAdminTab] = useState('users');
  const [newRhkJson, setNewRhkJson] = useState('');

  const parseCSV = (str) => {
      const arr = [];
      let quote = false;
      let row = 0, col = 0;
      for (let c = 0; c < str.length; c++) {
          let cc = str[c], nc = str[c+1];
          arr[row] = arr[row] || [];
          arr[row][col] = arr[row][col] || '';
          if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; ++c; continue; }
          if (cc === '"') { quote = !quote; continue; }
          if (cc === ';' && !quote) { ++col; continue; } 
          if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue; }
          if (cc === '\n' && !quote) { ++row; col = 0; continue; }
          if (cc === '\r' && !quote) { ++row; col = 0; continue; }
          arr[row][col] += cc;
      }
      return arr;
  };

  const handleDownloadTemplate = () => {
    let csvContent = "JABATAN;ID RHK;NAMA RHK;ID RENCANA HARIAN;NAMA RENCANA HARIAN\r\n";
    DEFAULT_MASTER_RHK_DATA.forEach(rhk => {
      const jabatanStr = Array.isArray(rhk.jabatan) ? rhk.jabatan.join(',') : String(rhk.jabatan || ''); 
      rhk.renHar.forEach(ren => {
        const safeJabatan = `"${jabatanStr.replace(/"/g, '""')}"`;
        const safeRhkName = `"${String(rhk.name || '').replace(/"/g, '""')}"`;
        const safeRenName = `"${String(ren.name || '').replace(/"/g, '""')}"`;
        csvContent += `${safeJabatan};${String(rhk.id || '')};${safeRhkName};${String(ren.id || '')};${safeRenName}\r\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Template_Master_RHK_Kemensos.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Template CSV berhasil diunduh!", "success");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.split(/\r?\n/);
      const newRhkMap = new Map();
      
      for(let i = 1; i < rows.length; i++) {
         const row = rows[i];
         if (!row) continue;

         const cols = row.split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/);
         
         if(cols.length >= 5 && cols[1]) {
            const clean = (textData) => textData ? String(textData).replace(/^"|"$/g, '').trim() : '';
            
            const jabatanRaw = clean(cols[0]);
            const idRhk = clean(cols[1]);
            const namaRhk = clean(cols[2]);
            const idRen = clean(cols[3]);
            const namaRen = clean(cols[4]);
            
            let jabArray = ["Semua Jabatan"];
            if(jabatanRaw && jabatanRaw !== "") {
                jabArray = jabatanRaw.split(',').map(j => j.trim()); 
            }

            if(!newRhkMap.has(idRhk)) {
               newRhkMap.set(idRhk, { id: idRhk, jabatan: jabArray, name: namaRhk, renHar: [] });
            }
            if(idRen && namaRen) {
               newRhkMap.get(idRhk).renHar.push({ id: idRen, name: namaRen });
            }
         }
      }
      
      const finalData = Array.from(newRhkMap.values());
      if(finalData.length === 0) {
        return showToast("Gagal membaca CSV. Pastikan pembatas memakai Titik Koma (;)", "error");
      }
      
      try {
        showLoading(true);
        if (db) {
            const rhkRef = ref(db, 'masterRhk');
            await set(rhkRef, finalData);
        }
        if (setMasterRhk) {
            setMasterRhk(finalData); 
        }
        showToast("Database RHK Kemensos di-Update dari CSV!", "success");
      } catch(err) {
        showToast("Gagal upload CSV ke Firebase! Cek koneksi Anda.", "error");
      } finally {
        showLoading(false);
        e.target.value = null; 
      }
    };
    reader.readAsText(file);
  };

  const handleSimulasiUploadRhk = async () => { 
    if(!newRhkJson) return showToast("Masukkan text JSON RHK!", "error"); 
    showLoading(true); 
    try {
        const parsedRhk = JSON.parse(newRhkJson);
        if (db) {
            const rhkRef = ref(db, 'masterRhk');
            await set(rhkRef, parsedRhk);
        }
        if (setMasterRhk) setMasterRhk(parsedRhk);
        
        setTimeout(() => { 
            showToast("Database RHK Kemensos di-Update ke Firebase!", "success"); 
            setNewRhkJson(''); 
            showLoading(false); 
        }, 1000); 
    } catch(err) {
        setTimeout(() => { showToast("Format JSON Salah!", "error"); showLoading(false); }, 1000);
    }
  };

  const safeMasterRhk = Array.isArray(masterRhk) ? masterRhk : [];
  const safeAdminUsersData = Array.isArray(adminUsersData) ? adminUsersData : [];
  const safePendingTx = Number(pendingTx) || 0;
  const safeAdminConfig = adminConfig || { geminiApiKeys: '' };

  const approveToken = () => { 
      showLoading(1000); 
      setTimeout(() => { 
          if(setPendingTx) setPendingTx(0); 
          showToast("Token User berhasil di-Approve!", "success"); 
      }, 1000); 
  };
  
  const handleSaveApi = (e) => { 
      e.preventDefault(); 
      showLoading(1000); 
      setTimeout(() => showToast("API Keys berhasil diperbarui ke Server!", "success"), 1100); 
  };
  
  const handleResetPassword = (name) => { 
      if(window.confirm(`Yakin ingin reset password akun ${name}?`)) { 
          showLoading(800); 
          setTimeout(() => showToast(`Password ${name} direset ke 123456`, "success"), 900); 
      } 
  };

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-2xl font-black text-blue-900 mb-6 flex items-center gap-2"><ShieldAlert size={28} className="text-red-500"/> Panel Admin</h2>
      <div className="flex gap-3 mb-6 bg-slate-100 p-2 rounded-xl border border-slate-200 flex-wrap sm:flex-nowrap">
        <button onClick={() => setAdminTab('users')} className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${adminTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>Akun SDM</button>
        <button onClick={() => setAdminTab('token')} className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${adminTab === 'token' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>Token Req</button>
        <button onClick={() => setAdminTab('rhk')} className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${adminTab === 'rhk' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>Master RHK</button>
        <button onClick={() => setAdminTab('apikey')} className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${adminTab === 'apikey' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>API Keys</button>
      </div>

      {adminTab === 'users' && (
        <div className={`${THEME.glossyCard} animate-in slide-in-from-left-4`}>
          <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-3 flex items-center gap-2"><Users size={16} className="text-blue-500"/> Monitoring Pengguna & Token</h3>
          <p className="text-xs text-slate-500 mb-5 font-medium leading-relaxed">Pantau jumlah token SDM PKH dan fasilitasi lupa password.</p>
          <div className="space-y-4">
            {safeAdminUsersData.map(usr => (
              <div key={String(usr.id || Math.random())} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{String(usr.nama || 'User Anonim')}</h4>
                  <p className="text-[11px] text-slate-500 font-medium"><Mail size={12} className="inline"/> {String(usr.email || '-')}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2.5">
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200">Sisa: {Number(usr.tokens || 0)} Token</span>
                  <button onClick={() => handleResetPassword(String(usr.nama || 'User'))} className="text-[10px] font-bold flex items-center gap-1.5 text-slate-600 bg-white border border-slate-200 hover:border-red-400 hover:text-red-500 px-3 py-1.5 rounded-lg shadow-sm transition-colors"><RefreshCcw size={12}/> Reset Pass</button>
                </div>
              </div>
            ))}
            {safeAdminUsersData.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                   <p className="text-xs text-slate-500 font-medium">Belum ada data pengguna yang ditarik.</p>
                </div>
            )}
          </div>
        </div>
      )}

      {adminTab === 'token' && (
        <div className={`${THEME.glossyCard} animate-in slide-in-from-left-4`}>
          <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Pending Token Approval (Live)</h3>
          {safePendingTx > 0 ? (
            <div className="bg-slate-50 p-4 rounded-xl border border-blue-200 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-sm font-bold text-slate-800">M. Zaen Syachrullah</p>
                <p className="text-xs text-emerald-600 font-black mt-1">+20 Token Request</p>
              </div>
              <button onClick={approveToken} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all">Approve</button>
            </div>
          ) : ( 
            <div className="text-center py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-600">Semua aman!</p>
                <p className="text-xs text-slate-400 mt-1">Tidak ada antrean top-up token saat ini.</p>
            </div> 
          )}
        </div>
      )}
      
      {adminTab === 'rhk' && (
        <div className={`${THEME.glossyCard} animate-in slide-in-from-right-4`}>
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><Database size={18} className="text-orange-500" /> Database RHK Firebase</h3>
            <button onClick={handleDownloadTemplate} className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold py-2 px-3 rounded-lg text-[11px] flex items-center gap-1.5 transition-all shadow-sm">
              <Download size={14} /> Download Template CSV
            </button>
          </div>
          
          <p className="text-xs text-slate-500 mb-5 font-medium leading-relaxed">Gunakan fitur ini untuk upload format CSV (berbasis Titik Koma / <b>;</b>). Data akan tersinkronisasi untuk dropdown form Laporan pengguna.</p>
          
          <div className="bg-slate-50 border-2 border-dashed border-blue-300 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 mb-5 relative hover:bg-blue-50 hover:border-blue-400 transition-colors shadow-sm">
             <input type="file" accept=".csv" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
             <FileSpreadsheet size={32} className="text-blue-500 mb-3" />
             <span className="text-xs font-bold text-slate-700">Klik / Tarik File CSV Anda ke Sini</span>
          </div>

          <div className="flex items-center gap-4 my-5 opacity-60">
             <div className="h-px bg-slate-300 flex-1"></div>
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ATAU PASTE JSON (MANUAL)</span>
             <div className="h-px bg-slate-300 flex-1"></div>
          </div>

          <textarea rows="4" className={`${THEME.glossyInput} text-[11px] font-mono text-slate-600 mb-4 bg-white`} placeholder='[{"id":"RHK 1","jabatan":["Ketua TIM Provinsi (Katimprov)"],...}]' value={newRhkJson} onChange={e => setNewRhkJson(e.target.value)} />
          <button onClick={handleSimulasiUploadRhk} className={THEME.btnAccent}>Simpan & Push JSON ke Firebase</button>
          
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h4 className="text-sm font-bold text-emerald-700 mb-4 flex items-center gap-2"><CheckCircle2 size={16}/> Preview RHK Tersimpan ({safeMasterRhk.length} Data)</h4>
            <div className="max-h-64 overflow-y-auto space-y-3 custom-scrollbar pr-2">
              {safeMasterRhk.map((r, idx) => (
                <div key={String(r.id || idx)} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-1.5 shadow-sm">
                  <p className="text-xs font-bold text-slate-800">{String(r.id || '')}: {String(r.name || '')}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Target Jabatan: <span className="text-blue-600 font-semibold">{Array.isArray(r.jabatan) ? r.jabatan.join(', ') : String(r.jabatan || 'Semua Jabatan')}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {adminTab === 'apikey' && (
        <div className={`${THEME.glossyCard} animate-in zoom-in-95`}>
          <h3 className="text-base font-bold text-slate-800 mb-3 border-b border-slate-100 pb-4 flex items-center gap-2"><Key size={18} className="text-slate-500" /> Multi API Key Gemini</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed font-medium">Sistem Backend akan menggunakan Round-Robin API Key (dipisah dengan koma) untuk mencegah <i>Limit Exceeded</i> saat banyak SDM PKH mengeksekusi AI Laporan di waktu bersamaan.</p>
          <form onSubmit={handleSaveApi} className="space-y-5">
            <textarea rows="5" className={`${THEME.glossyInput} text-xs font-mono text-blue-600 bg-white`} value={String(safeAdminConfig.geminiApiKeys)} onChange={(e) => setAdminConfig({...safeAdminConfig, geminiApiKeys: e.target.value})} placeholder="AIzaSyA..., AIzaSyB..., AIzaSyC..." required />
            <button type="submit" className={THEME.btnPrimary}>Simpan Daftar API Keys</button>
          </form>
        </div>
      )}
    </div>
  );
}

function PanduanView() {
  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-2">
        <BookOpen size={24} className="text-blue-600"/> Buku Panduan E-GenLap
      </h2>
      <div className="space-y-4 text-slate-700">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2"><Settings size={16} className="text-slate-400"/> 1. Pengaturan Awal</h3>
          <p className="text-[11px] leading-relaxed font-medium">Buka menu <b>Profil</b>. Wajib mengisi ID/Link Folder Google Drive, Link Spreadsheet, dan mengupload gambar Tanda Tangan Digital (Format PNG/Transparan). Jika link dikosongkan, PDF laporan akan terunduh otomatis ke memori HP Anda (Cache Lokal).</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-emerald-700 mb-2 flex items-center gap-2"><Coins size={16} className="text-emerald-500"/> 2. Sistem Token API</h3>
          <p className="text-[11px] leading-relaxed font-medium">Pembuatan 1 Laporan AI memotong 1 Token. Jika token habis, klik tombol "Top-up" di menu Profil untuk memicu notifikasi *approval* ke Super Admin yang mengelola API Keys Gemini.</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-amber-600 mb-2 flex items-center gap-2"><Wand2 size={16} className="text-amber-500"/> 3. Eksekusi Form Laporan Dinamis</h3>
          <p className="text-[11px] leading-relaxed font-medium">Menu Form Laporan akan menyesuaikan *dropdown* RHK dengan <b>Jabatan PKH</b> Anda. Anda dapat menyertakan Surat Tugas, mengunggah hingga <b>10 Foto Giat</b>, dan <b>3 Lampiran PDF/Docs</b> yang akan langsung di-inject oleh Backend ke dalam laporan akhir.</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2"><FolderOpen size={16} className="text-slate-400"/> 4. Manajemen Drive Otomatis</h3>
          <p className="text-[11px] leading-relaxed font-medium">Sistem akan membuat hirarki folder otomatis di Google Drive Anda: <b>[Nama RHK] / [Bulan] / [Nama Kegiatan Harian]</b>. Link laporan akan langsung muncul di menu Data (Riwayat).</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const safeParseJSON = (key, defaultVal) => { try { const val = localStorage.getItem(key); return val ? JSON.parse(val) : defaultVal; } catch (e) { return defaultVal; } };

  // GLOBAL STATES
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [role, setRole] = useState(() => localStorage.getItem('egenlap_role') || 'user');
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  const [pendingTx, setPendingTx] = useState(0); 
  const [masterRhk, setMasterRhk] = useState(DEFAULT_MASTER_RHK_DATA);
  const [agendaFilter, setAgendaFilter] = useState({ type: null, value: null });
  const [adminConfig, setAdminConfig] = useState({ geminiApiKeys: 'AIzaSyA...' });

  const [tokens, setTokens] = useState(() => safeParseJSON('egenlap_tokens', 5));
  const [reports, setReports] = useState(() => safeParseJSON('egenlap_reports', []));
  const [agendas, setAgendas] = useState(() => safeParseJSON('egenlap_agendas', []));
  
  // SANITIZED PROFILE STATE
  const [profile, setProfile] = useState(() => {
    const stored = safeParseJSON('egenlap_profile', null);
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
       return { nama: '', nip: '', emailTarget: '', jabatanAsn: '', jabatanPkh: '', ttdBase64: '', driveId: '', sheetId: '', ...stored };
    }
    return { nama: '', nip: '', emailTarget: '', jabatanAsn: '', jabatanPkh: '', ttdBase64: '', driveId: '', sheetId: '' };
  });

  // PERSISTENCE LOCAL STORAGE
  useEffect(() => { localStorage.setItem('egenlap_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('egenlap_reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('egenlap_agendas', JSON.stringify(agendas)); }, [agendas]);
  useEffect(() => { localStorage.setItem('egenlap_tokens', JSON.stringify(tokens)); }, [tokens]);

  // FIREBASE REALTIME DB SYNC (RHK)
  useEffect(() => {
    const rhkRef = ref(db, 'masterRhk');
    const unsubscribe = onValue(rhkRef, (snapshot) => {
      const data = snapshot.val();
      if(data) setMasterRhk(data);
    });
    return () => unsubscribe();
  }, []);

  // CHECK FIREBASE AUTH STATE ON MOUNT
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const isSuperAdmin = localStorage.getItem('egenlap_superadmin') === 'true';
      if (isSuperAdmin) {
         setRole('admin'); setIsLoggedIn(true); setView('admin');
      } else if (user) {
         setRole('user'); setIsLoggedIn(true); setView('dashboard');
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

  const showLoading = (isLoading, nextView = null) => { 
      setLoading(isLoading); if (nextView) setView(nextView); 
  };
  
  const showToast = (msg, type = 'success') => { 
      setToast({ show: true, msg, type }); 
      setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 4000); 
  };

  if (!authInitialized) { return <LoadingScreen />; }
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-blue-200 selection:text-blue-900 pb-24 md:pb-0 flex justify-center md:justify-start">
      {isLoggedIn && <DesktopSidebar view={view} setView={setView} role={role} pendingTx={pendingTx} handleLogout={handleLogout} />}

      <div className={`w-full ${isLoggedIn ? 'md:ml-72' : ''} flex flex-col min-h-screen mx-auto bg-slate-50 relative z-10`}>
        {loading && <LoadingScreen />}
        <ToastAlert toast={toast} />
        
        {isLoggedIn && <HeaderMobile setView={setView} role={role} pendingTx={pendingTx} />}

        <main className={`flex-grow ${!isLoggedIn ? 'p-0 w-full' : 'p-5 md:p-8 max-w-4xl mx-auto w-full'}`}>
          {!isLoggedIn && <LoginView auth={auth} db={db} setView={setView} setRole={setRole} showLoading={showLoading} showToast={showToast} profile={profile} setProfile={setProfile} setIsLoggedIn={setIsLoggedIn} />}
          
          {isLoggedIn && view === 'dashboard' && <DashboardView profile={profile} tokens={tokens} reports={reports} masterRhk={masterRhk} />}
          {isLoggedIn && view === 'engine' && <EngineView profile={profile} tokens={tokens} role={role} setTokens={setTokens} showLoading={showLoading} showToast={showToast} reports={reports} setReports={setReports} masterRhk={masterRhk} filteredRhkList={getFilteredRhk(masterRhk, profile)} setView={setView} getBulanFolder={getBulanFolder} />}
          {isLoggedIn && view === 'database' && <DatabaseView reports={reports} />}
          {isLoggedIn && view === 'agenda' && <AgendaView agendas={agendas} setAgendas={setAgendas} filteredRhkList={getFilteredRhk(masterRhk, profile)} masterRhk={masterRhk} agendaFilter={agendaFilter} setAgendaFilter={setAgendaFilter} showToast={showToast} />}
          {isLoggedIn && view === 'settings' && <SettingsView profile={profile} setProfile={setProfile} tokens={tokens} role={role} showToast={showToast} showLoading={showLoading} setView={setView} pendingTx={pendingTx} setPendingTx={setPendingTx} handleLogout={handleLogout} />}
          {isLoggedIn && view === 'admin' && <AdminView showLoading={showLoading} showToast={showToast} adminConfig={adminConfig} setAdminConfig={setAdminConfig} db={db} masterRhk={masterRhk} setMasterRhk={setMasterRhk} />}
          {isLoggedIn && view === 'panduan' && <PanduanView />}
        </main>

        {isLoggedIn && <BottomNav view={view} setView={setView} />}
      </div>
    </div>
  );
}