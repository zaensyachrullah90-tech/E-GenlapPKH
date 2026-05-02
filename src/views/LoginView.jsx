import React, { useState } from 'react';
import { LogIn, UserPlus, Key, Mail, Sparkles, BrainCircuit, Rocket, ShieldCheck } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { ref, set, get, child } from "firebase/database";
import { THEME } from '../utils/constants';

export default function LoginView({ auth, db, setView, setRole, showLoading, showToast, profile, setProfile, setIsLoggedIn }) {
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
            const dbRef = ref(db);
            const snapshot = await get(child(dbRef, `users/${userCredential.user.uid}`));
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
            await set(ref(db, 'users/' + userCredential.user.uid), {
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
          <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('[https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)')" }}></div>
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
          <div className="text-center mb-8 md:hidden relative z-10">
             <div className="flex justify-center items-center mb-4 drop-shadow-xl relative w-24 h-24 mx-auto animate-pulse"><img src="/logo.png" alt="GL Logo" className="w-full h-full object-contain" /></div>
             <h2 className="text-3xl font-black text-blue-900 tracking-tight mt-2">E-GenLap PKH</h2>
             <p className="text-sm text-emerald-600 mt-1 font-bold">Sistem Pelaporan Cerdas SDM PKH</p>
          </div>

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
                    <option value="Ketua TIM Provinsi (Katimprov)">Ketua TIM Provinsi (Katimprov)</option>
                    <option value="Ketua TIM Kabupaten / Kota (Katimkabkot)">Ketua TIM Kabupaten / Kota (Katimkabkot)</option>
                    <option value="PENATA LAYANAN OPERASIONAL">PENATA LAYANAN OPERASIONAL</option>
                    <option value="PENGELOLA LAYANAN OP-DIII">PENGELOLA LAYANAN OP-DIII</option>
                    <option value="OPERATOR LAYANAN OP-SMA2">OPERATOR LAYANAN OP-SMA2</option>
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