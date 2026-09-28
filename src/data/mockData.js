// ==========================================
// DATA DUMMY / SIMULASI (BUKAN DATA AKTUAL)
// ==========================================

export const DUMMY_NAVIGATION = [
  { id: 'overview', label: 'Ringkasan', icon: '📊' },
  { id: 'analytics', label: 'Analitik', icon: '📈' },
  { id: 'transactions', label: 'Transaksi', icon: '💳' },
  { id: 'settings', label: 'Pengaturan', icon: '⚙️' },
]

export const PAGE_HEADER_INFO = {
  overview: {
    title: 'Ringkasan Kinerja',
    subtitle: 'Ringkasan performa penjualan dan statistik aktivitas utama',
  },
  analytics: {
    title: 'Analisis & Grafik Performa',
    subtitle: 'Visualisasi tren pendapatan bulanan dan distribusi penjualan kategori',
  },
  transactions: {
    title: 'Riwayat Transaksi',
    subtitle: 'Daftar dan status seluruh transaksi pembayaran pelanggan',
  },
  settings: {
    title: 'Pengaturan Sistem',
    subtitle: 'Kelola preferensi profil, notifikasi, dan tampilan akun simulasi',
  },
}

export const DUMMY_METRICS = [
  {
    id: 1,
    title: 'Total Pendapatan',
    value: 'Rp 128.450.000',
    trend: '+12.5%',
    isPositive: true,
    icon: '💰',
    period: 'vs bulan lalu',
  },
  {
    id: 2,
    title: 'Total Pesanan',
    value: '1.420',
    trend: '+8.2%',
    isPositive: true,
    icon: '📦',
    period: 'vs bulan lalu',
  },
  {
    id: 3,
    title: 'Pelanggan Baru',
    value: '328',
    trend: '+15.3%',
    isPositive: true,
    icon: '👥',
    period: 'vs bulan lalu',
  },
  {
    id: 4,
    title: 'Rasio Konversi',
    value: '4.8%',
    trend: '-0.4%',
    isPositive: false,
    icon: '🎯',
    period: 'vs bulan lalu',
  },
]

// Data bulanan untuk Recharts (Total Pendapatan = Rp 128.450.000, Total Pesanan = 1.420)
export const DUMMY_MONTHLY_CHART = [
  { month: 'Jan', revenue: 14200000, orders: 160 },
  { month: 'Feb', revenue: 18500000, orders: 210 },
  { month: 'Mar', revenue: 16800000, orders: 195 },
  { month: 'Apr', revenue: 24300000, orders: 275 },
  { month: 'Mei', revenue: 22650000, orders: 250 },
  { month: 'Jun', revenue: 32000000, orders: 330 },
]

// Data kategori untuk Recharts Donut Chart (Total = 100%, Nilai = Rp 128.450.000, Pesanan = 1.420)
export const DUMMY_CATEGORIES = [
  {
    name: 'Elektronik & Gadget',
    percentage: 45,
    value: 57802500,
    orders: 639,
    color: '#3b82f6',
  },
  {
    name: 'Peralatan Kantor',
    percentage: 25,
    value: 32112500,
    orders: 355,
    color: '#10b981',
  },
  {
    name: 'Perabot & Furnitur',
    percentage: 18,
    value: 23121000,
    orders: 256,
    color: '#f59e0b',
  },
  {
    name: 'Aksesoris Tambahan',
    percentage: 12,
    value: 15414000,
    orders: 170,
    color: '#8b5cf6',
  },
]

export const DUMMY_TRANSACTIONS = [
  {
    id: 'TRX-1001',
    customer: 'Budi Santoso',
    product: 'Laptop Pro 14 Inch',
    date: '24 Sep 2026',
    amount: 'Rp 14.500.000',
    status: 'Selesai',
    statusClass: 'status-success',
  },
  {
    id: 'TRX-1002',
    customer: 'Siti Rahma',
    product: 'Mouse Wireless Ergonomis',
    date: '24 Sep 2026',
    amount: 'Rp 250.000',
    status: 'Selesai',
    statusClass: 'status-success',
  },
  {
    id: 'TRX-1003',
    customer: 'Ahmad Fauzi',
    product: 'Meja Kerja Minimalis',
    date: '23 Sep 2026',
    amount: 'Rp 1.200.000',
    status: 'Menunggu',
    statusClass: 'status-pending',
  },
  {
    id: 'TRX-1004',
    customer: 'Dewi Lestari',
    product: 'Keyboard Mekanikal RGB',
    date: '23 Sep 2026',
    amount: 'Rp 850.000',
    status: 'Selesai',
    statusClass: 'status-success',
  },
  {
    id: 'TRX-1005',
    customer: 'Hendra Pratama',
    product: 'Monitor 27 Inch 144Hz',
    date: '22 Sep 2026',
    amount: 'Rp 3.400.000',
    status: 'Gagal',
    statusClass: 'status-failed',
  },
]

export const DUMMY_ANALYTICS_INSIGHTS = [
  {
    title: 'Rata-rata Nilai Pesanan',
    value: 'Rp 2.840.000',
    trend: '+4.1%',
    isPositive: true,
    icon: '🏷️',
  },
  {
    title: 'Pengunjung Unik',
    value: '45.210',
    trend: '+18.9%',
    isPositive: true,
    icon: '🌐',
  },
  {
    title: 'Tingkat Retensi Pelanggan',
    value: '68.4%',
    trend: '+2.3%',
    isPositive: true,
    icon: '🔄',
  },
]
