import React from 'react';
import { Settings, User, Database, FileText, Trash2, Upload, LogIn } from 'lucide-react';
import { THEME } from '../utils/constants';

export default function SettingsView({ profile, setProfile, tokens, role, showToast, showLoading, setView, pendingTx, setPendingTx, handleLogout }) {
  const handleSaveAll = () => { 
      showLoading(1000); 
      setTimeout(() => showToast("Semua profil dan Link berhasil disimpan!", "success"), 1100); 
  };

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-2xl font-black text-blue-900 mb-6 flex items-center gap-2"><Settings size={28} className="text-slate-600"/> Pengaturan Profil</h2>
      
      <div className={`${THEME.glossyCard} mb-6`}>
        <h3 className="text-sm font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2 flex items-center gap-2"><User size={18} className="text-blue-600" /> Identitas SDM PKH</h3>
        <div className="space-y-5">
          <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Nama Lengkap</label><input type="text" className={THEME.glossyInput} value={profile?.nama || ''} onChange={(e) => setProfile(prev => ({...prev, nama: e.target.value}))} placeholder="Ketik Nama Lengkap" /></div>
          <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">NIP (Opsional)</label><input type="number" className={THEME.glossyInput} value={profile?.nip || ''} onChange={(e) => setProfile(prev => ({...prev, nip: e.target.value}))} placeholder="Kosongkan jika tidak ada" /></div>
          
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-5 shadow-sm">
            <div>
              <label className="text-[10px] font-bold text-blue-700 mb-1 block uppercase tracking-wider">Jabatan PKH</label>
              <select className={THEME.glossyInput} value={profile?.jabatanPkh || ''} onChange={(e) => setProfile(prev => ({...prev, jabatanPkh: e.target.value}))}>
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
              <select className={THEME.glossyInput} value={profile?.jabatanAsn || ''} onChange={(e) => setProfile(prev => ({...prev, jabatanAsn: e.target.value}))}>
                <option value="">-- Pilih Jabatan ASN --</option>
                <option value="Penata Layanan Operasional">Penata Layanan Operasional</option>
                <option value="Pengelola Layanan Operasional">Pengelola Layanan Operasional</option>
                <option value="Operator Layanan Operasional">Operator Layanan Operasional</option>
              </select>
            </div>
          </div>
          
          <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Email Target (Untuk PDF)</label><input type="email" className={THEME.glossyInput} value={profile?.emailTarget || ''} onChange={(e) => setProfile(prev => ({...prev, emailTarget: e.target.value}))} placeholder="Email Anda" /></div>
        </div>
      </div>

      <div className={THEME.glossyCard + " mb-6"}>
        <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><Database size={18} className="text-emerald-600" /> Integrasi Penyimpanan Cloud</h3>
        <p className="text-[11px] text-slate-500 font-medium mb-5">Jika link di bawah kosong, laporan AI otomatis terunduh (download) ke perangkat Anda.</p>
        <div className="space-y-5">
          <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Link Folder Drive</label><input type="text" className={THEME.glossyInput} value={profile?.driveId || ''} onChange={(e) => setProfile(prev => ({...prev, driveId: e.target.value}))} placeholder="Paste URL Folder Drive" /></div>
          <div><label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Link Spreadsheet</label><input type="text" className={THEME.glossyInput} value={profile?.sheetId || ''} onChange={(e) => setProfile(prev => ({...prev, sheetId: e.target.value}))} placeholder="Paste URL Spreadsheet" /></div>
        </div>
      </div>
      
      <div className={`${THEME.glossyCard} mb-6`}>
        <h3 className="text-sm font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2 flex items-center gap-2"><FileText size={18} className="text-amber-500" /> Tanda Tangan Digital (Wajib)</h3>
        <div className="space-y-4">
          {profile?.ttdBase64 ? (
            <div className="relative w-48 h-32 bg-slate-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-center shadow-inner mx-auto group overflow-hidden">
              <img src={profile.ttdBase64} alt="TTD" className="max-w-full max-h-full object-contain" />
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
      
      {role !== 'admin' && (
        <div className="mb-6 p-6 bg-white border border-slate-200 shadow-sm rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-base font-black text-slate-800">Sisa Token AI: <span className="text-blue-600 text-xl">{tokens}</span></p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Beli token untuk generate Laporan.</p>
          </div>
          <button onClick={() => { showLoading(1000); setTimeout(() => { showToast("Request dikirim ke Admin!", "success"); setPendingTx(pendingTx+1); }, 1100); }} className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-extrabold px-5 py-3 rounded-xl shadow-md active:scale-95 transition-all">Top-up</button>
        </div>
      )}

      <div className="space-y-4">
         <button onClick={handleSaveAll} className={THEME.btnPrimary}>Simpan Profil & Storage</button>
         <button onClick={handleLogout} className="w-full text-red-600 font-bold py-4 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 active:scale-95 transition-all flex justify-center items-center gap-2 text-sm shadow-sm"><LogIn size={18} /> Keluar / Logout Sistem</button>
      </div>
    </div>
  );
}
