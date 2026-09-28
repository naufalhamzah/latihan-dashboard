import { useEffect, useState, useCallback } from 'react';
import MetricCard from '../components/MetricCard';
import TransactionTable from '../components/TransactionTable';
import RevenueBarChart from '../components/RevenueBarChart';

function OverviewPage({ onNavigate }) {
  const [summary, setSummary] = useState(null);
  const [monthlyChart, setMonthlyChart] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, monthlyRes, transRes] = await Promise.all([
        fetch('/api/summary'),
        fetch('/api/monthly'),
        fetch('/api/transactions'),
      ]);

      if (!summaryRes.ok) throw new Error(`Gagal memuat ringkasan (HTTP ${summaryRes.status})`);
      if (!monthlyRes.ok) throw new Error(`Gagal memuat grafik bulanan (HTTP ${monthlyRes.status})`);
      if (!transRes.ok) throw new Error(`Gagal memuat data transaksi (HTTP ${transRes.status})`);

      const summaryData = await summaryRes.json();
      const monthlyData = await monthlyRes.json();
      const transData = await transRes.json();

      setSummary(summaryData);
      setMonthlyChart(monthlyData);
      setTransactions(transData);
    } catch (err) {
      console.error('Error fetching overview data:', err);
      // Sesuai persyaratan: jangan menggunakan dummy sebagai fallback saat API gagal
      setError(err.message || 'Gagal memuat data overview dari server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Memuat data ringkasan dari database MySQL...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        <p><strong>Terjadi Kesalahan:</strong> {error}</p>
        <button type="button" className="btn-retry" onClick={fetchData}>
          Coba Muat Ulang
        </button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="page-empty">
        <p>Data ringkasan tidak ditemukan di database.</p>
      </div>
    );
  }

  // Bangun kartu metrik berbasis data aktual MySQL
  const metrics = [
    {
      id: 1,
      title: 'Total Pendapatan (Selesai)',
      value: `Rp ${Number(summary.completed_revenue || 0).toLocaleString('id-ID')}`,
      trend: `${summary.completed_transactions || 0} pesanan selesai`,
      isPositive: true,
      icon: '💰',
      period: `Nilai Bruto: Rp ${Number(summary.total_transaction_value || 0).toLocaleString('id-ID')}`,
    },
    {
      id: 2,
      title: 'Total Pesanan',
      value: `${summary.total_transactions || 0}`,
      trend: `${summary.completed_transactions || 0} Selesai, ${summary.processing_transactions || 0} Diproses`,
      isPositive: true,
      icon: '📦',
      period: `${summary.cancelled_transactions || 0} Dibatalkan (dikeluarkan)`,
    },
    {
      id: 3,
      title: 'Pelanggan Baru',
      value: 'Data belum tersedia',
      trend: 'Data belum tersedia',
      isPositive: null,
      icon: '👥',
      period: 'Skema belum mendukung histori registrasi',
    },
    {
      id: 4,
      title: 'Rasio Konversi',
      value: 'Data belum tersedia',
      trend: 'Data belum tersedia',
      isPositive: null,
      icon: '🎯',
      period: 'Tidak ada data traffic pengunjung',
    },
  ];

  return (
    <>
      {/* 4 Kartu Metrik Utama */}
      <section className="metrics-grid">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            trend={metric.trend}
            isPositive={metric.isPositive}
            icon={metric.icon}
            period={metric.period}
          />
        ))}
      </section>

      {/* Banner Penjelasan Definisi Pendapatan & Status */}
      <section className="info-banner">
        <div className="info-banner-header">
          <span>ℹ️</span> Definisi Pendapatan & Kebijakan Status Transaksi:
        </div>
        <ul className="info-banner-list">
          <li>
            <strong>Pendapatan Realisasi:</strong> Dihitung hanya dari transaksi berstatus <code>Selesai</code> (<code>quantity * unit_price</code>) sebesar <strong>Rp {Number(summary.completed_revenue || 0).toLocaleString('id-ID')}</strong>.
          </li>
          <li>
            <strong>Perlakuan Status Dibatalkan:</strong> {summary.cancelled_transactions} transaksi dibatalkan (senilai Rp {Number(summary.cancelled_revenue || 0).toLocaleString('id-ID')}) <em>dikeluarkan</em> dari total pendapatan.
          </li>
          <li>
            <strong>Perlakuan Status Diproses:</strong> {summary.processing_transactions} transaksi berstatus diproses (senilai Rp {Number(summary.processing_revenue || 0).toLocaleString('id-ID')}) masuk ke nilai transaksi kotor (gross) dan menunggu realisasi.
          </li>
          <li>
            <strong>Keterbatasan Skema:</strong> Metrik <em>Pelanggan Baru</em> dan <em>Rasio Konversi</em> menampilkan <em>"Data belum tersedia"</em> karena skema tabel <code>transactions</code> tidak mencakup data traffic atau histori akun pengguna.
          </li>
        </ul>
      </section>

      {/* Ringkasan Cepat: Cuplikan Grafik & Cuplikan Transaksi */}
      <div className="overview-bottom-grid">
        {/* Cuplikan Tren Grafik Interaktif */}
        <div className="chart-card">
          <div className="quick-action-header">
            <div>
              <h2 className="chart-title">Tren Pendapatan Bulanan</h2>
              <p className="chart-subtitle">
                Data realisasi pendapatan dari database MySQL
              </p>
            </div>
            <button
              type="button"
              className="btn-link"
              onClick={() => onNavigate('analytics')}
            >
              Buka Analitik →
            </button>
          </div>
          {monthlyChart.length > 0 ? (
            <RevenueBarChart data={monthlyChart} height={220} />
          ) : (
            <div className="page-empty">
              <p>Belum ada data bulanan.</p>
            </div>
          )}
        </div>

        {/* Cuplikan Transaksi Terbaru */}
        <div className="table-card">
          <div className="quick-action-header">
            <div>
              <h2 className="table-title">Transaksi Terkini</h2>
              <p className="chart-subtitle">3 transaksi paling baru dari database</p>
            </div>
            <button
              type="button"
              className="btn-link"
              onClick={() => onNavigate('transactions')}
            >
              Lihat Semua →
            </button>
          </div>
          {transactions.length > 0 ? (
            <TransactionTable
              transactions={transactions.slice(0, 3)}
              isCompact={true}
            />
          ) : (
            <div className="page-empty">
              <p>Tidak ada transaksi.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default OverviewPage;
