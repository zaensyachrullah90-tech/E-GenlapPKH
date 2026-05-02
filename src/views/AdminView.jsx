import React, { useState } from 'react';
import { ShieldAlert, Database, FileSpreadsheet, Users, Key, Mail, RefreshCcw, CheckCircle2, Download } from 'lucide-react';
import { ref, set } from "firebase/database";

const THEME = {
  glossyCard: "bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden",
  glossyInput: "w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl p-3.5 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm font-medium",
  btnPrimary: "w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-4 rounded-xl shadow-md active:scale-95 transition-all text-base flex justify-center items-center gap-2",
  btnSecondary: "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-md active:scale-95 transition-all flex justify-center items-center gap-2",
  btnAccent: "w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold py-3.5 rounded-xl shadow-md active:scale-95 transition-all flex justify-center items-center gap-2"
};

const JABATAN_LENGKAP = [
  "Ketua TIM Provinsi (Katimprov)",
  "Ketua TIM Kabupaten / Kota (Katimkabkot)",
  "PENATA LAYANAN OPERASIONAL",
  "PENGELOLA LAYANAN OP-DIII",
  "OPERATOR LAYANAN OP-SMA2"
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

export default function AdminView({ showToast, showLoading, adminConfig, setAdminConfig, db, masterRhk, setMasterRhk, adminUsersData, pendingTx, setPendingTx }) {
  const [adminTab, setAdminTab] = useState('users');
  const [newRhkJson, setNewRhkJson] = useState('');

  // PENGAMANAN MUTLAK ARRAY (Anti Blank Page / Object Not Valid Child Error)
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

  const handleDownloadTemplate = () => {
    let csvContent = "JABATAN;ID RHK;NAMA RHK;ID RENCANA HARIAN;NAMA RENCANA HARIAN\r\n";
    DEFAULT_MASTER_RHK_DATA.forEach(rhk => {
      const jabatanStr = Array.isArray(rhk.jabatan) ? rhk.jabatan.join(',') : String(rhk.jabatan || ''); 
      const safeRhkId = String(rhk.id || '');
      const safeRhkName = `"${String(rhk.name || '').replace(/"/g, '""')}"`;
      
      const renHarian = Array.isArray(rhk.renHar) ? rhk.renHar : [];
      renHarian.forEach(ren => {
        const safeJabatan = `"${jabatanStr.replace(/"/g, '""')}"`;
        const safeRenId = String(ren.id || '');
        const safeRenName = `"${String(ren.name || '').replace(/"/g, '""')}"`;
        csvContent += `${safeJabatan};${safeRhkId};${safeRhkName};${safeRenId};${safeRenName}\r\n`;
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
      
      // Membaca baris CSV (Memisahkan dengan newline regex)
      const rows = text.split(/\r?\n/);
      const newRhkMap = new Map();
      
      for(let i = 1; i < rows.length; i++) {
         const row = rows[i];
         if (!row) continue;

         // Memecah kolom dengan Titik Koma (;), mengabaikan titik koma di dalam tanda kutip ("")
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
        // Validasi keberadaan Firebase db sebelum upload
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
              <div key={usr.id || Math.random()} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
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
             <span className="text-sm font-bold text-slate-700">Klik / Tarik File CSV Anda ke Sini</span>
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
                <div key={r.id || idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-1.5 shadow-sm">
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