import React from 'react';
import { BookOpen, Settings, Coins, Wand2, FolderOpen } from 'lucide-react';
import { THEME } from '../utils/constants';

export default function PanduanView() {
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