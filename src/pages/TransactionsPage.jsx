// TransactionsPage.jsx – renders transaction list fetched from backend API
import { useEffect, useState, useCallback } from 'react';
import TransactionTable from '../components/TransactionTable';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch('/api/transactions')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch transactions:', err);
        setError('Gagal memuat data transaksi. Silakan periksa koneksi ke backend.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Memuat data transaksi dari MySQL…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        <p>{error}</p>
        <button type="button" className="btn-retry" onClick={fetchTransactions}>
          Coba Lagi
        </button>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="page-empty">
        <p>Tidak ada transaksi tersedia di database.</p>
      </div>
    );
  }

  return (
    <div className="transactions-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h2 className="page-title">Riwayat Transaksi</h2>
        <span className="live-badge" style={{ fontSize: '12px' }}>
          {transactions.length} Transaksi Tercatat
        </span>
      </div>
      <TransactionTable transactions={transactions} />
    </div>
  );
}

export default TransactionsPage;
