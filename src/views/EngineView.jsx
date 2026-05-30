import React, { useState } from 'react';
import { Wand2, Clock, MapPin, FileText, ListTodo, PenTool, CloudUpload, Image as ImageIcon, XCircle, FilePlus, Trash2, Zap } from 'lucide-react';
import { THEME, GAS_API_URL, getFilteredRhk, getFilteredRenHar, getBulanFolder } from '../utils/constants';
import { ref, update } from "firebase/database";

export default function EngineView({ profile, tokens, role, setTokens, showToast, showLoading, reports, setReports, masterRhk, setView, auth, db }) {
  const [rhkId, setRhkId] = useState('');
  const [renHarId, setRenHarId] = useState('');
  const [tglLaporan, setTglLaporan] = useState('');
  const [jamMulai, setJamMulai] = useState('');
  const [jamSelesai, setJamSelesai] = useState('');
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

  // LOGIKA SMART FILTER: RHK dan Rencana Harian
  const availableRhks = getFilteredRhk(masterRhk, profile);
  const selectedRhkMaster = availableRhks.find(r => r.id === rhkId);
  const availableRenHars = getFilteredRenHar(selectedRhkMaster?.renHar, profile);

  // KABUPATEN DIAMBIL LANGSUNG DARI PROFIL (READ ONLY)
  const kabupaten = profile?.kabupaten || 'Belum Diatur di Profil';

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
    
    // Identitas otomatis mengirim (Nama, NIP, Jabatan, TTD, dll dari profil)
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
      
      const renHarName = availableRenHars.find(h => h.id === renHarId)?.name || 'Kegiatan';
      const folderBulan = getBulanFolder(tglLaporan);
      
      const newReport = {
        id: Date.now(), tgl: tglLaporan, jam: jamMulai, k: dynamicData.judul || renHarName,
        status: "Sukses", rhkId: rhkId, folderPath: `${rhkId} / ${folderBulan} / ${renHarName}`, driveLink: result.driveLink || '#'
      };
      
      const updatedReports = [newReport, ...reports];
      setReports(updatedReports);
      
      const user = auth?.currentUser;
      if (user && db) await update(ref(db, `users/${user.uid}`), { reports: updatedReports, tokens: tokens - 1 });
      
      if (!profile.driveId) {
          showToast("Laporan diunduh ke HP. Mohon upload manual.", "success");
          if(result.pdfBase64) {
            const link = document.createElement('a'); link.href = `data:application/pdf;base64,${result.pdfBase64}`; link.download = `Laporan_${tglLaporan}.pdf`;
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
          } else { triggerDummyDownload(`Laporan_${tglLaporan}`); }
      } else { showToast("Laporan Berhasil ke Drive!", "success"); }
    } catch (err) {
       if(role !== 'admin') setTokens(t => t - 1);
       const renHarName = availableRenHars.find(h => h.id === renHarId)?.name || 'Kegiatan';
       const folderBulan = getBulanFolder(tglLaporan);

       const newReport = {
         id: Date.now(), tgl: tglLaporan, jam: jamMulai, k: dynamicData.judul || renHarName,
         status: "Sukses Lokal", rhkId: rhkId, folderPath: `${rhkId} / ${folderBulan} / ${renHarName}`, driveLink: '#'
       };
       const updatedReports = [newReport, ...reports];
       setReports(updatedReports);

       const user = auth?.currentUser;
       if (user && db) await update(ref(db, `users/${user.uid}`), { reports: updatedReports, tokens: tokens - 1 });

       if (!profile.driveId) {
           showToast("Laporan Diunduh (Offline Mode).", "success");
           triggerDummyDownload(`Laporan_${tglLaporan}`);
       } else { showToast("Simulasi Offline Berhasil", "success"); }
    } finally {
        showLoading(false);
        setView('database');
    }
  };

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
              <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">RHK (Otomatis Filter Jabatan)</label>
              <select className={THEME.glossyInput} value={rhkId} onChange={e => {setRhkId(e.target.value); setRenHarId(''); setDynamicData({});}} required>
                <option value="">-- Pilih RHK Kemensos --</option>
                {availableRhks.map(r => <option key={r.id} value={r.id}>{r.id} - {r?.name?.substring(0, 75)}...</option>)}
              </select>
            </div>
            {rhkId && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Rencana Harian (Otomatis Filter Jabatan)</label>
                <select className={THEME.glossyInput} value={renHarId} onChange={e => setRenHarId(e.target.value)} required>
                  <option value="">-- Pilih Rencana Harian --</option>
                  {availableRenHars.map(h => <option key={h.id} value={h.id}>{h.id} - {h?.name?.substring(0, 75)}...</option>)}
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
                <div>
                   <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase tracking-wider">Kabupaten/Kota (Otomatis)</label>
                   <input type="text" className={`${THEME.glossyInput} bg-slate-100 cursor-not-allowed text-slate-500 font-bold`} value={kabupaten} readOnly title="Diambil otomatis dari Pengaturan Profil Anda" />
                </div>
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
