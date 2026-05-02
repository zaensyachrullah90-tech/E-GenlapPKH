import React from 'react';
import { BarChart3, CheckCircle2, XCircle } from 'lucide-react';
import { THEME, RHK_TARGETS } from '../utils/constants';

export default function DashboardView({ profile, tokens, reports, masterRhk }) {
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
      
      return jabatanStr.includes("Semua Jabatan") || 
             jabatanStr.includes(userPkh) || 
             jabatanStr.includes(userAsn);
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
                     <td className="py-4 px-3">
                        <span className="font-bold text-blue-700">{rhkId}</span> - <span className="font-medium">{rhkName.substring(0,55)}...</span>
                     </td>
                     <td className="py-4 px-2 text-center font-black text-slate-800 text-sm">
                        {yearlyTarget}{isPersentase ? '%' : ''}
                     </td>
                     <td className="py-4 px-2 text-center font-black text-slate-800 text-sm bg-slate-50/50">
                        {monthlyTarget} <span className="text-[9px] font-medium text-slate-400">Lap</span>
                     </td>
                     <td className="py-4 px-2 text-center text-blue-600 font-black text-sm">
                        {reportsThisMonth}
                     </td>
                     <td className="py-4 px-2 text-center font-black text-sm">
                        {sisa > 0 ? <span className="text-orange-500">{sisa}</span> : <span className="text-emerald-500">0</span>}
                     </td>
                     <td className="py-4 px-2 text-center">
                        {sisa <= 0 ? 
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1.5 rounded-md font-bold shadow-sm"><CheckCircle2 size={12} /> Tercapai</span> 
                          : 
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1.5 rounded-md font-bold shadow-sm"><XCircle size={12} /> Kurang</span>
                        }
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