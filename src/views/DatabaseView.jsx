import React from 'react';
import { Database, Clock, CheckCircle2, FolderOpen, ChevronRight, ExternalLink } from 'lucide-react';
import { THEME } from '../utils/constants';

export default function DatabaseView({ reports }) {
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