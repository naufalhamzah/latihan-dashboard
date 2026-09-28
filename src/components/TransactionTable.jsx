// Helper format Rupiah
const formatRupiah = (val) => {
  if (typeof val === 'number') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  }
  if (typeof val === 'string' && !val.startsWith('Rp')) {
    const num = Number(val);
    if (!isNaN(num)) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(num);
    }
  }
  return val || '-';
};

const getStatusBadgeClass = (status, existingClass) => {
  if (existingClass) return existingClass;
  if (status === 'Selesai') return 'status-success';
  if (status === 'Diproses') return 'status-pending';
  if (status === 'Dibatalkan') return 'status-failed';
  return 'status-neutral';
};

function TransactionTable({ transactions = [], isCompact = false }) {
  if (isCompact) {
    return (
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pelanggan</th>
              <th>Nominal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx) => {
              const customerName = trx.customer || trx.customer_name || 'Pelanggan';
              const productName = trx.product || trx.product_name || '-';
              const amountDisplay = trx.amount || formatRupiah(trx.total_amount);
              const statusClass = getStatusBadgeClass(trx.status, trx.statusClass);

              return (
                <tr key={trx.id}>
                  <td>
                    <strong>{customerName}</strong>
                    <br />
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {productName}
                    </span>
                  </td>
                  <td>{amountDisplay}</td>
                  <td>
                    <span className={`status-badge ${statusClass}`}>
                      {trx.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID Transaksi</th>
            <th>Nama Pelanggan</th>
            <th>Produk & Kategori</th>
            <th>Qty & Harga</th>
            <th>Tanggal</th>
            <th>Total Nominal</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((trx) => {
            const customerName = trx.customer || trx.customer_name || 'Pelanggan';
            const productName = trx.product || trx.product_name || '-';
            const categoryName = trx.category || '';
            const amountDisplay = trx.amount || formatRupiah(trx.total_amount);
            const dateDisplay = trx.date || trx.formatted_date || trx.transaction_date;
            const statusClass = getStatusBadgeClass(trx.status, trx.statusClass);

            return (
              <tr key={trx.id}>
                <td className="trx-id">#{trx.id}</td>
                <td>
                  <strong>{customerName}</strong>
                </td>
                <td>
                  <strong>{productName}</strong>
                  {categoryName && (
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {categoryName}
                    </div>
                  )}
                </td>
                <td>
                  {trx.quantity != null ? (
                    <span>
                      {trx.quantity} x {formatRupiah(trx.unit_price)}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td>{dateDisplay}</td>
                <td>
                  <strong>{amountDisplay}</strong>
                </td>
                <td>
                  <span className={`status-badge ${statusClass}`}>
                    {trx.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
