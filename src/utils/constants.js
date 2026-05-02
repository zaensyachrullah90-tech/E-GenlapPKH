export const THEME = {
  glossyCard: "bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden",
  glossyInput: "w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl p-3.5 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm font-medium",
  btnPrimary: "w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-4 rounded-xl shadow-md active:scale-95 transition-all text-base flex justify-center items-center gap-2",
  btnSecondary: "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-md active:scale-95 transition-all flex justify-center items-center gap-2",
  btnAccent: "w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold py-3.5 rounded-xl shadow-md active:scale-95 transition-all flex justify-center items-center gap-2"
};

export const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyLxsYQZJG6NRZCs5O1tW306bXhFWT423evkaWhaUAa4DoT4zDDEwoeAIl1_EpRe3SKSg/exec";

export const RHK_TARGETS = {
  "RHK 1": 12,
  "RHK 2": 180,
  "RHK 3": 24,
  "RHK 4": 24,
  "RHK 5": 36,
  "RHK 6": 100,
  "RHK 7": 12,
  "RHK 8": 24,
  "RHK 9": 100
};

const JABATAN_LENGKAP = [
  "Ketua TIM Provinsi (Katimprov)",
  "Ketua TIM Kabupaten / Kota (Katimkabkot)",
  "PENATA LAYANAN OPERASIONAL",
  "PENGELOLA LAYANAN OP-DIII",
  "OPERATOR LAYANAN OP-SMA2"
];

export const DEFAULT_MASTER_RHK_DATA = [
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

export const getBulanFolder = (dateString) => {
  if (!dateString) return "01. Januari";
  const date = new Date(dateString);
  const months = ["01. Januari", "02. Februari", "03. Maret", "04. April", "05. Mei", "06. Juni", "07. Juli", "08. Agustus", "09. September", "10. Oktober", "11. November", "12. Desember"];
  return months[date.getMonth()];
};

export const getFilteredRhk = (masterRhk, profile) => {
  const safeMasterRhk = Array.isArray(masterRhk) ? masterRhk : [];
  if(!profile?.jabatanPkh && !profile?.jabatanAsn) return safeMasterRhk;

  const userJabatanPkh = String(profile?.jabatanPkh || "");
  const userJabatanAsn = String(profile?.jabatanAsn || "");

  return safeMasterRhk.filter(rhk => {
    if (!rhk.jabatan || rhk.jabatan === "Semua Jabatan") return true;
    if (Array.isArray(rhk.jabatan)) {
      return rhk.jabatan.includes("Semua Jabatan") || 
             rhk.jabatan.includes(userJabatanPkh) || 
             rhk.jabatan.includes(userJabatanAsn);
    }
    const strJabatan = String(rhk.jabatan);
    return strJabatan.includes("Semua Jabatan") || strJabatan.includes(userJabatanPkh) || strJabatan.includes(userJabatanAsn);
  });
};