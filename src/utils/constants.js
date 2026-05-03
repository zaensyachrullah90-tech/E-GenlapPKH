export const THEME = {
  glossyCard: "bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden",
  glossyInput: "w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl p-3.5 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm font-medium",
  btnPrimary: "w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-4 rounded-xl shadow-md active:scale-95 transition-all text-base flex justify-center items-center gap-2",
  btnSecondary: "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-md active:scale-95 transition-all flex justify-center items-center gap-2",
  btnAccent: "w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold py-3.5 rounded-xl shadow-md active:scale-95 transition-all flex justify-center items-center gap-2"
};

export const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyLxsYQZJG6NRZCs5O1tW306bXhFWT423evkaWhaUAa4DoT4zDDEwoeAIl1_EpRe3SKSg/exec";

export const RHK_TARGETS = {
  "RHK 1": 12, "RHK 2": 180, "RHK 3": 24, "RHK 4": 24, "RHK 5": 36, "RHK 6": 100, "RHK 7": 12, "RHK 8": 24, "RHK 9": 100
};

// PERBAIKAN: Menyisipkan array "jabatan" secara spesifik di dalam setiap Rencana Harian (renHar)
export const DEFAULT_MASTER_RHK_DATA = [
  { id: "RHK 1", jabatan: ["Semua Jabatan", "Pendamping Sosial", "Pendamping Sosial (S1/D4)", "Pendamping Sosial (D3)", "Pendamping Sosial (SMA)"], name: "Penyaluran Bantuan Sosial", renHar: [
      {id: "1.1", name: "Melakukan edukasi pencairan", jabatan: ["Pendamping Sosial", "Pendamping Sosial (S1/D4)", "Pendamping Sosial (D3)", "Pendamping Sosial (SMA)"]}, 
      {id: "1.2", name: "Melaksanakan Supervisi Permasalahan", jabatan: ["Koordinator Kabupaten (Katimkab)", "Koordinator Wilayah (Korwil)", "Koordinator Provinsi (Katimprov)"]}
  ]},
  { id: "RHK 2", jabatan: ["Semua Jabatan", "Pendamping Sosial", "Pendamping Sosial (S1/D4)", "Pendamping Sosial (D3)", "Pendamping Sosial (SMA)"], name: "Pertemuan Peningkatan Kemampuan Keluarga (P2K2)", renHar: [
      {id: "2.1", name: "Melaksanakan Pertemuan P2K2", jabatan: ["Pendamping Sosial", "Pendamping Sosial (S1/D4)", "Pendamping Sosial (D3)", "Pendamping Sosial (SMA)"]},
      {id: "2.2", name: "Melakukan Supervisi P2K2", jabatan: ["Koordinator Kabupaten (Katimkab)", "Koordinator Wilayah (Korwil)"]}
  ]},
  { id: "RHK 3", jabatan: ["Semua Jabatan", "Pendamping Sosial", "Pendamping Sosial (S1/D4)", "Pendamping Sosial (D3)", "Pendamping Sosial (SMA)"], name: "Verifikasi Komitmen KPM", renHar: [
      {id: "3.1", name: "Melakukan verifikasi kehadiran anggota KPM", jabatan: ["Pendamping Sosial", "Pendamping Sosial (S1/D4)", "Pendamping Sosial (D3)", "Pendamping Sosial (SMA)"]},
      {id: "3.2", name: "Melaksanakan supervisi Verifikasi", jabatan: ["Koordinator Kabupaten (Katimkab)", "Koordinator Wilayah (Korwil)"]}
  ]},
  { id: "RHK 4", jabatan: ["Semua Jabatan", "Operator Layanan Operasional", "Pendamping Sosial", "Pendamping Sosial (S1/D4)"], name: "Pemutakhiran Data KPM", renHar: [
      {id: "4.1", name: "Melakukan pemutakhiran data KPM PKH", jabatan: ["Pendamping Sosial", "Pendamping Sosial (S1/D4)", "Pendamping Sosial (D3)", "Pendamping Sosial (SMA)"]},
      {id: "4.2", name: "Melaksanakan proses bisnis verifikasi validasi", jabatan: ["Operator Layanan Operasional", "Pengelola Layanan Operasional"]}
  ]},
  { id: "RHK 5", jabatan: ["Semua Jabatan", "Koordinator Kabupaten (Katimkab)", "Koordinator Wilayah (Korwil)"], name: "Rekonsiliasi Penyaluran", renHar: [
      {id: "5.1", name: "Melaksanakan kegiatan rekonsiliasi", jabatan: ["Koordinator Kabupaten (Katimkab)", "Koordinator Wilayah (Korwil)"]}
  ]},
  { id: "RHK 6", jabatan: ["Semua Jabatan", "Pendamping Sosial", "Pendamping Sosial (S1/D4)", "Pendamping Sosial (D3)", "Pendamping Sosial (SMA)"], name: "Respon Kasus & Pengaduan", renHar: [
      {id: "6.1", name: "Melaksanakan Respon Kasus/Kerentanan", jabatan: ["Semua Jabatan"]}
  ]},
  { id: "RHK 7", jabatan: ["Semua Jabatan", "Koordinator Kabupaten (Katimkab)"], name: "Supervisi Laporan Bulanan", renHar: [
      {id: "7.1", name: "Membuat rekap laporan bulanan pelaksanaan PKH", jabatan: ["Koordinator Kabupaten (Katimkab)", "Koordinator Provinsi (Katimprov)"]}
  ]},
  { id: "RHK 8", jabatan: ["Semua Jabatan", "Koordinator Provinsi (Katimprov)"], name: "Tugas Direktif & Koordinasi", renHar: [
      {id: "8.1", name: "Melakukan koordinasi dengan instansi terkait", jabatan: ["Koordinator Provinsi (Katimprov)"]},
      {id: "8.2", name: "Melaksanakan Tindak Lanjut Hasil Pemeriksaan (TLHP)", jabatan: ["Koordinator Provinsi (Katimprov)"]}
  ]},
  { id: "RHK 9", jabatan: ["Semua Jabatan"], name: "Penyebaran Berita Baik Kemensos", renHar: [
      {id: "9.1", name: "Berperan aktif menyebarkan di Media Sosial", jabatan: ["Semua Jabatan"]}
  ]}
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

  const userPkh = String(profile?.jabatanPkh || "").toLowerCase();
  const userAsn = String(profile?.jabatanAsn || "").toLowerCase();

  return safeMasterRhk.filter(rhk => {
    if (!rhk.jabatan) return true;
    const jabatanArray = Array.isArray(rhk.jabatan) ? rhk.jabatan : [rhk.jabatan];
    return jabatanArray.some(jab => {
       const j = String(jab).toLowerCase();
       if (j.includes("semua jabatan")) return true;
       if (userPkh && userPkh !== '-' && (j.includes(userPkh) || userPkh.includes(j))) return true;
       if (userAsn && userAsn !== '-' && (j.includes(userAsn) || userAsn.includes(j))) return true;
       return false;
    });
  });
};

export const getFilteredRenHar = (renHarArray, profile) => {
  if (!Array.isArray(renHarArray)) return [];
  const userPkh = String(profile?.jabatanPkh || "").toLowerCase();
  const userAsn = String(profile?.jabatanAsn || "").toLowerCase();

  return renHarArray.filter(ren => {
    if (!ren.jabatan || ren.jabatan.length === 0) return true;
    const jabatanArray = Array.isArray(ren.jabatan) ? ren.jabatan : [ren.jabatan];
    return jabatanArray.some(jab => {
       const j = String(jab).toLowerCase();
       if (j.includes("semua jabatan")) return true;
       if (userPkh && userPkh !== '-' && (j.includes(userPkh) || userPkh.includes(j))) return true;
       if (userAsn && userAsn !== '-' && (j.includes(userAsn) || userAsn.includes(j))) return true;
       return false;
    });
  });
};