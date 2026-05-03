import React, { useState } from 'react';
import { LogIn, UserPlus, Key, Mail, Sparkles, BrainCircuit, Rocket, ShieldCheck, Camera } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { ref, set, get, child } from "firebase/database";
import { THEME } from '../utils/constants.js';

export default function LoginView({ auth, db, setView, setRole, showLoading, showToast, profile, setProfile, setIsLoggedIn }) {
  const [loginMode, setLoginMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regData, setRegData] = useState({ gelarDepan: '', nama: '', gelarBelakang: '', nip: '', jabatanAsn: '', jabatanPkh: '', kabupaten: '', ttdBase64: '' });

  const handleTtdUpload = (e) => {
    const file = e.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = (ev) => setRegData({...regData, ttdBase64: ev.target.result});
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading(true);

    if (loginMode === 'login' && email === 'zaensyachrullah90@gmail.com' && password === 'Egenlap26') {
        const superAdminProfile = {
          nama: 'M. Zaen Syachrullah, S.Kom', nip: '199001012026011001', emailTarget: email,
          jabatanAsn: 'Penata Layanan Operasional', jabatanPkh: 'Administrator Database', kabupaten: 'Kabupaten Tapin',
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
                const userData = snapshot.val();
                setProfile({ ...profile, ...userData, emailTarget: email });
            } else {
                setProfile({ ...profile, nama: 'SDM PKH', emailTarget: email });
            }
            
            setRole('user');
            showToast("Login Berhasil!", "success");
            setIsLoggedIn(true);
            setView('dashboard');

        } else if (loginMode === 'register') {
            // PROSES PENDAFTARAN KOMPLIT KE DATABASE FIREBASE
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            const fullName = `${regData.gelarDepan ? regData.gelarDepan + ' ' : ''}${regData.nama}${regData.gelarBelakang ? ', ' + regData.gelarBelakang : ''}`;

            const newProfileData = {
                nama: fullName,
                nip: regData.nip || '-',
                jabatanPkh: regData.jabatanPkh || '-',
                jabatanAsn: regData.jabatanAsn || '-',
                kabupaten: regData.kabupaten || '-',
                email: email, 
                tokens: 3, // OTOMATIS DAPAT 3 TOKEN
                ttdBase64: regData.ttdBase64 || '',
                driveId: '',
                sheetId: ''
            };

            await set(ref(db, `users/${user.uid}`), newProfileData);
            setProfile(newProfileData);

            showToast("Pendaftaran berhasil! Akun dan profil telah tersimpan ke Database.", "success");
            setLoginMode('login');
            setPassword('');

        } else if (loginMode === 'forgot') {
            await sendPasswordResetEmail(auth, email);
            showToast("Tautan reset password telah dikirim ke email.", "success");
            setLoginMode('login');
        }
    } catch (error) {
        let msg = "Terjadi kesalahan.";
        if(error.code === 'auth/email-already-in-use') msg = "Email ini sudah terdaftar!";
        if(error.code === 'auth/weak-password') msg = "Password terlalu lemah (minimal 6 karakter).";
        if(error.code === 'auth/invalid-credential') msg = "Email atau password salah.";
        showToast(msg, "error");
    } finally {
        showLoading(false);
    }
  };

  const FeatureItem = ({ icon, title, description }) => (
    <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/10 transition-colors duration-300">
      <div className="p-2.5 bg-white/10 rounded-xl shadow-inner backdrop-blur-sm shrink-0">{icon}</div>
      <div><h4 className="font-bold text-white mb-0.5 text-sm">{title}</h4><p className="text-blue-100 text-[11px] leading-relaxed">{description}</p></div>
    </div>
  );

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 relative z-50 p-4 md:p-8 overflow-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl w-full h-[95vh] bg-white shadow-2xl rounded-3xl md:rounded-[2.5rem] flex flex-col md:flex-row relative z-10 overflow-hidden">
        
        {/* KOLOM KIRI (TIDAK SCROLL) */}
        <div className="hidden md:flex flex-col justify-center bg-blue-900 w-1/2 p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('[https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)')" }}></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-800/60 rounded-full border border-blue-500/30 text-blue-100 text-[10px] font-bold mb-4 backdrop-blur-md shadow-inner">
              <Sparkles size={14} className="text-yellow-400" /> Transformasi Digital SDM PKH
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">Laporan Semudah <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-yellow-300">Menjetikkan Jari</span></h1>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed font-medium">E-GenLap Cloud membawa revolusi dalam pelaporan SDM PKH. Tinggalkan cara manual, sambut efisiensi tak terbatas bertenaga AI.</p>

            <div className="space-y-2">
              <FeatureItem icon={<BrainCircuit size={20} className="text-emerald-300" />} title="AI Report Engine" description="Cukup ketik kronologi kasar di lapangan, AI Kemensos meraciknya menjadi bahasa birokrasi profesional." />
              <FeatureItem icon={<Rocket size={20} className="text-yellow-300" />} title="Otomatisasi PDF & Drive" description="Tanda tangan terpasang otomatis, PDF tersusun rapi di folder Google Drive Anda." />
              <FeatureItem icon={<ShieldCheck size={20} className="text-blue-300" />} title="Tersinkronisasi & Aman" description="Bekerja offline atau online, data tersinkronisasi mulus dengan Database." />
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (FORM SCROLL) */}
        <div className="w-full md:w-1/2 h-full overflow-y-auto custom-scrollbar p-6 md:p-12 relative">
            <div className="text-center mb-6 md:hidden relative z-10 mt-4">
               <div className="flex justify-center items-center mb-3 drop-shadow-xl relative w-20 h-20 mx-auto animate-pulse"><img src="/logo.png" alt="GL Logo" className="w-full h-full object-contain" /></div>
               <h2 className="text-2xl font-black text-blue-900 tracking-tight mt-2">E-GenLap PKH</h2>
               <p className="text-xs text-emerald-600 mt-1 font-bold">Sistem Pelaporan Cerdas SDM PKH</p>
            </div>

            <div className="hidden md:flex justify-center mb-6"><img src="/logo.png" alt="GL Logo" className="w-16 h-16 object-contain drop-shadow-md" /></div>

            {loginMode === 'login' && (
              <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-right-4 max-w-sm mx-auto w-full">
                <div className="text-center mb-6"><h3 className="text-xl font-black text-slate-800">Selamat Datang</h3><p className="text-xs text-slate-500 mt-1 font-medium">Masuk untuk melanjutkan ke sistem pelaporan</p></div>
                <div><label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Email Terdaftar</label><input type="email" placeholder="contoh@pkh.go.id" className={THEME.glossyInput} value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div><label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Password</label><input type="password" placeholder="••••••••" className={THEME.glossyInput} value={password} onChange={e => setPassword(e.target.value)} required /></div>
                <div className="pt-2"><button type="submit" className={THEME.btnPrimary}><LogIn size={18} /> Masuk ke E-GenLap</button></div>
                <div className="flex justify-between items-center text-[11px] mt-4 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setLoginMode('forgot')} className="text-slate-500 hover:text-blue-700 transition-colors font-semibold">Lupa Password?</button>
                  <button type="button" onClick={() => setLoginMode('register')} className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg"><UserPlus size={14}/> Daftar Baru</button>
                </div>
              </form>
            )}

            {loginMode === 'register' && (
              <form onSubmit={handleSubmit} className="space-y-3 animate-in slide-in-from-left-4 max-w-md mx-auto w-full">
                <div className="text-center mb-4 pb-2 border-b border-slate-100">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full mb-2 text-emerald-600"><UserPlus size={16}/></div>
                    <h3 className="text-base font-black text-slate-800">Daftar Akun Baru</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Dapatkan 3 Token Awal gratis.</p>
                </div>
                
                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-3"><input type="text" placeholder="Gelar Dpn" className={`${THEME.glossyInput} text-[10px] p-2.5`} onChange={e => setRegData({...regData, gelarDepan: e.target.value})} /></div>
                    <div className="col-span-6"><input type="text" placeholder="Nama Lengkap *" className={`${THEME.glossyInput} text-[10px] p-2.5`} onChange={e => setRegData({...regData, nama: e.target.value})} required /></div>
                    <div className="col-span-3"><input type="text" placeholder="Gelar Blk" className={`${THEME.glossyInput} text-[10px] p-2.5`} onChange={e => setRegData({...regData, gelarBelakang: e.target.value})} /></div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="NIP (Kosong Jika Non-ASN)" className={`${THEME.glossyInput} text-[10px] p-2.5`} onChange={e => setRegData({...regData, nip: e.target.value})} />
                  <input type="text" placeholder="Kabupaten Tugas *" className={`${THEME.glossyInput} text-[10px] p-2.5`} onChange={e => setRegData({...regData, kabupaten: e.target.value})} required />
                </div>

                <div>
                  <select className={`${THEME.glossyInput} text-[10px] p-2.5`} onChange={e => setRegData({...regData, jabatanPkh: e.target.value})} required>
                    <option value="">-- Pilih Jabatan PKH --</option>
                    <option value="Koordinator Wilayah (Korwil)">Koordinator Wilayah (Korwil)</option>
                    <option value="Koordinator Provinsi (Katimprov)">Koordinator Provinsi (Katimprov)</option>
                    <option value="Koordinator Kabupaten (Katimkab)">Koordinator Kabupaten (Katimkab)</option>
                    <option value="Pendamping Sosial (S1/D4)">Pendamping Sosial (S1/D4)</option>
                    <option value="Pendamping Sosial (D3)">Pendamping Sosial (D3)</option>
                    <option value="Pendamping Sosial (SMA)">Pendamping Sosial (SMA)</option>
                    <option value="Administrator Database">Administrator Database</option>
                  </select>
                </div>

                <div>
                  <select className={`${THEME.glossyInput} text-[10px] p-2.5`} onChange={e => setRegData({...regData, jabatanAsn: e.target.value})} required>
                    <option value="">-- Pilih Jabatan ASN --</option>
                    <option value="Penata Layanan Operasional">Penata Layanan Operasional</option>
                    <option value="Pengelola Layanan Operasional">Pengelola Layanan Operasional</option>
                    <option value="Operator Layanan Operasional">Operator Layanan Operasional</option>
                  </select>
                </div>

                <div className="bg-slate-50 border border-dashed border-blue-300 rounded-xl p-2 flex items-center justify-between text-slate-500 relative hover:bg-blue-50 transition-colors">
                   <input type="file" accept="image/png" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleTtdUpload} required />
                   <div className="flex items-center gap-2 pl-2">
                     <Camera size={16} className="text-blue-500" />
                     <span className="text-[9px] font-bold text-slate-600">Upload TTD (PNG) *</span>
                   </div>
                   {regData.ttdBase64 ? (
                      <div className="w-12 h-6 mr-2"><img src={regData.ttdBase64} alt="TTD" className="w-full h-full object-contain" /></div>
                   ) : ( <span className="text-[9px] text-red-400 pr-2">Belum Upload</span> )}
                </div>

                <div><input type="email" placeholder="Email Aktif *" className={`${THEME.glossyInput} text-[10px] p-2.5`} value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div><input type="password" placeholder="Buat Password (Min 6 Karakter) *" className={`${THEME.glossyInput} text-[10px] p-2.5`} value={password} onChange={e => setPassword(e.target.value)} required minLength="6" /></div>
                
                <div className="pt-2">
                    <button type="submit" className={THEME.btnSecondary}>Daftar & Klaim Token</button>
                    <button type="button" onClick={() => setLoginMode('login')} className="w-full text-center text-[10px] text-slate-500 hover:text-blue-700 transition-colors font-semibold mt-3 flex items-center justify-center gap-1"><LogIn size={12}/> Kembali ke Login</button>
                </div>
              </form>
            )}

            {loginMode === 'forgot' && (
              <form onSubmit={handleSubmit} className="space-y-4 animate-in zoom-in-95 max-w-sm mx-auto w-full">
                <div className="text-center mb-6"><div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-3 text-amber-600"><Key size={24}/></div><h3 className="text-xl font-black text-slate-800">Reset Password</h3><p className="text-xs text-slate-500 mt-2 px-4 leading-relaxed font-medium">Masukkan email terdaftar Anda. Kami akan mengirimkan tautan pemulihan.</p></div>
                <div><input type="email" placeholder="Email Terdaftar" className={THEME.glossyInput} value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div className="pt-2"><button type="submit" className={THEME.btnAccent}><Mail size={16}/> Kirim Link Reset</button></div>
                <div className="text-center mt-6 pt-4 border-t border-slate-100"><button type="button" onClick={() => setLoginMode('login')} className="text-xs text-slate-500 hover:text-blue-700 transition-colors font-semibold">Kembali ke halaman Login</button></div>
              </form>
            )}
        </div>
      </div>
    </div>
  );
}
