import React, { useState } from 'react';
import { CalendarDays, Plus, XCircle, Clock, Filter, Camera } from 'lucide-react';
import { THEME, getFilteredRhk, getFilteredRenHar } from '../utils/constants';

export default function AgendaView({ profile, agendas, setAgendas, masterRhk, agendaFilter, setAgendaFilter, showToast, auth, db }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tgl: '', jam: '', kegiatan: '', rhkId: '', renHarId: '', keterangan: '', foto: null });

  const availableRhks = getFilteredRhk(masterRhk, profile);
  const selectedRhkMaster = availableRhks.find(r => r?.id === form.rhkId);
  const availableRenHars = getFilteredRenHar(selectedRhkMaster?.renHar, profile);

  const safeFilter = agendaFilter || { type: null, value: null };

  const handleFilter = (type, value) => {
    if (safeFilter.type === type && safeFilter.value === value) setAgendaFilter({ type: null, value: null });
    else { setAgendaFilter({ type, value }); showToast(`Filter Aktif: ${value}`, "success"); }
  };

  const handleAddAgenda = async (e) => {
    e.preventDefault();
    if (!form.rhkId || !form.renHarId) return showToast("Harap pilih RHK dan Rencana Harian!", "error");
    
    const newAgenda = { id: Date.now(), ...form };
    const updatedAgendas = [newAgenda, ...agendas];
    
    setAgendas(updatedAgendas);
    setForm({ tgl: '', jam: '', kegiatan: '', rhkId: '', renHarId: '', keterangan: '', foto: null });
    setShowForm(false);
    
    const user = auth?.currentUser;
    if (user && db) {
        const { update, ref } = await import('firebase/database');
        await update(ref(db, `users/${user.uid}`), { agendas: updatedAgendas });
    }
    showToast("Agenda berhasil disimpan ke Cloud!", "success");
  };

  const displayedAgendas = agendas.filter(a => !safeFilter.type || a[safeFilter.type] === safeFilter.value);

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
                {availableRhks.map(r => <option key={r.id} value={r.id}>{r.id} - {r?.name?.substring(0, 50)}...</option>)}
              </select>
            </div>
            {form.rhkId && (
              <div className="animate-in fade-in slide-in-from-left-2">
                <label className="text-[10px] font-bold text-slate-600 mb-1 block uppercase tracking-wider">Rencana Harian (Difilter Berdasarkan Jabatan)</label>
                <select className={THEME.glossyInput} value={form.renHarId} onChange={e => setForm({...form, renHarId: e.target.value})} required>
                  <option value="">-- Pilih Rencana Harian --</option>
                  {availableRenHars.map(h => <option key={h.id} value={h.id}>{h.id} - {h?.name?.substring(0, 50)}...</option>)}
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
          const rhkName = masterRhk.find(r => r?.id === item.rhkId)?.name;
          const renHarName = masterRhk.find(r => r?.id === item.rhkId)?.renHar?.find(h => h?.id === item.renHarId)?.name;

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