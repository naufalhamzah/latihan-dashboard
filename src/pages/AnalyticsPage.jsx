import { useEffect, useState, useCallback } from 'react';
import MetricCard from '../components/MetricCard';
import RevenueBarChart from '../components/RevenueBarChart';
import CategoryPieChart from '../components/CategoryPieChart';

function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [monthlyChart, setMonthlyChart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, monthlyRes, categoriesRes] = await Promise.all([
        fetch('/api/summary'),
        fetch('/api/monthly'),
        fetch('/api/categories'),
      ]);

      if (!summaryRes.ok) throw new Error(`Gagal memuat ringkasan (HTTP ${summaryRes.status})`);
      if (!monthlyRes.ok) throw new Error(`Gagal memuat tren bulanan (HTTP ${monthlyRes.status})`);
      if (!categoriesRes.ok) throw new Error(`Gagal memuat kategori (HTTP ${categoriesRes.status})`);

      const summaryData = await summaryRes.json();
      const monthlyData = await monthlyRes.json();
      const categoriesData = await categoriesRes.json();

      setSummary(summaryData);
      setMonthlyChart(monthlyData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      // Sesuai aturan: jangan menggunakan dummy sebagai fallback saat API gagal
      setError(err.message || 'Gagal memuat data analitik dari server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Memuat data analitik dan agregasi dari database MySQL...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        <p><strong>Terjadi Kesalahan:</strong> {error}</p>
        <button type="button" className="btn-retry" onClick={fetchAnalyticsData}>
          Coba Muat Ulang
        </button>
      </div>
    );
  }

  // Insight analitik yang dihitung dari agregasi database MySQL
  const insights = [
    {
      title: 'Rata-rata Nilai Pesanan',
      value: `Rp ${Number(summary?.average_order_value || 0).toLocaleString('id-ID')}`,
      trend: `${summary?.completed_transactions || 0} transaksi selesai`,
      isPositive: true,
      icon: '🏷️',
      period: 'Berdasarkan transaksi selesai',
    },
    {
      title: 'Nilai Transaksi Keseluruhan',
      value: `Rp ${Number(summary?.total_transaction_value || 0).toLocaleString('id-ID')}`,
      trend: `${summary?.total_transactions || 0} total pesanan`,
      isPositive: true,
      icon: '💳',
      period: 'Termasuk diproses & dibatalkan',
    },
    {
      title: 'Pengunjung Unik',
      value: 'Data belum tersedia',
      trend: 'Data belum tersedia',
      isPositive: null,
      icon: '🌐',
      period: 'Skema tabel tidak mencatat traffic web',
    },
    {
      title: 'Tingkat Retensi Pelanggan',
      value: 'Data belum tersedia',
      trend: 'Data belum tersedia',
      isPositive: null,
      icon: '🔄',
      period: 'Perlu pencatatan histori akun pelanggan',
    },
  ];

  return (
    <>
      {/* Kartu Insight Analitik */}
      <section className="metrics-grid">
        {insights.map((insight, idx) => (
          <MetricCard
            key={idx}
            title={insight.title}
            value={insight.value}
            trend={insight.trend}
            isPositive={insight.isPositive}
            icon={insight.icon}
            period={insight.period}
          />
        ))}
      </section>

      {/* Banner Penjelasan Transparansi Metrik & Status */}
      <section className="info-banner">
        <div className="info-banner-header">
          <span>📊</span> Transparansi Analisis & Aturan Agregasi MySQL:
        </div>
        <ul className="info-banner-list">
          <li>
            <strong>Rumus Nilai Transaksi:</strong> <code>quantity * unit_price</code> dihitung dinamis dari seluruh baris tabel <code>transactions</code>.
          </li>
          <li>
            <strong>Realisasi Pendapatan:</strong> Pendapatan bersih diakui hanya untuk transaksi <code>Selesai</code> senilai <strong>Rp {Number(summary?.completed_revenue || 0).toLocaleString('id-ID')}</strong>.
          </li>
          <li>
            <strong>Transaksi Dibatalkan:</strong> {summary?.cancelled_transactions || 0} transaksi senilai Rp {Number(summary?.cancelled_revenue || 0).toLocaleString('id-ID')} tidak disertakan dalam pendapatan.
          </li>
          <li>
            <strong>Metrik Tanpa Sumber Data:</strong> Metrik seperti <em>Pengunjung Unik</em> dan <em>Tingkat Retensi</em> tidak dibuat-buat atau disimulasikan, melainkan diberi label <em>"Data belum tersedia"</em> secara transparan.
          </li>
        </ul>
      </section>

      {/* 2 Panel Grafik Interaktif Recharts */}
      <section className="charts-grid">
        {/* Grafik 1: Batang Pendapatan */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h2 className="chart-title">Grafik Pendapatan Bulanan</h2>
              <p className="chart-subtitle">
                Realisasi pendapatan per periode dari database MySQL
              </p>
            </div>
            <span
              className="chart-placeholder-badge"
              style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}
            >
              Live Data
            </span>
          </div>
          {monthlyChart.length > 0 ? (
            <RevenueBarChart data={monthlyChart} height={260} />
          ) : (
            <div className="page-empty">
              <p>Data tren bulanan tidak tersedia.</p>
            </div>
          )}
        </div>

        {/* Grafik 2: Distribusi Kategori (Donut Chart) */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h2 className="chart-title">Distribusi Kategori Produk</h2>
              <p className="chart-subtitle">
                Proporsi nilai penjualan per kategori produk dari MySQL
              </p>
            </div>
            <span
              className="chart-placeholder-badge"
              style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}
            >
              Live Data
            </span>
          </div>
          {categories.length > 0 ? (
            <CategoryPieChart data={categories} height={260} />
          ) : (
            <div className="page-empty">
              <p>Data kategori tidak tersedia.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default AnalyticsPage;
