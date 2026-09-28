function SettingsPage({
  userName,
  onUserNameChange,
  userEmail,
  onUserEmailChange,
  currency,
  onCurrencyChange,
  notifyEmail,
  onNotifyEmailChange,
  notifyWeekly,
  onNotifyWeeklyChange,
  showSaveAlert,
  onSave,
}) {
  return (
    <div className="settings-container">
      <form onSubmit={onSave}>
        {/* Bagian 1: Profil Akun */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h2 className="settings-section-title">Profil Pengguna</h2>
            <p className="settings-section-desc">
              Informasi identitas akun dashboard latihan
            </p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                className="form-input"
                value={userName}
                onChange={(e) => onUserNameChange(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Alamat Email</label>
              <input
                type="email"
                className="form-input"
                value={userEmail}
                onChange={(e) => onUserEmailChange(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mata Uang Default</label>
              <select
                className="form-select"
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value)}
              >
                <option value="IDR">IDR (Rupiah Indonesia)</option>
                <option value="USD">USD (Dolar Amerika)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Zona Waktu</label>
              <select className="form-select" defaultValue="WIB">
                <option value="WIB">WIB (UTC+07:00) Jakarta</option>
                <option value="WITA">WITA (UTC+08:00) Denpasar</option>
                <option value="WIT">WIT (UTC+09:00) Jayapura</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bagian 2: Preferensi Notifikasi */}
        <div className="settings-card" style={{ marginTop: '20px' }}>
          <div className="settings-card-header">
            <h2 className="settings-section-title">Preferensi Notifikasi</h2>
            <p className="settings-section-desc">
              Atur cara Anda menerima pembaruan sistem latihan
            </p>
          </div>

          <div className="checkbox-list">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => onNotifyEmailChange(e.target.checked)}
              />
              <div className="checkbox-text">
                <span className="checkbox-title">Email Transaksi Baru</span>
                <span className="checkbox-desc">
                  Kirim notifikasi email otomatis setiap ada pesanan masuk
                </span>
              </div>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={notifyWeekly}
                onChange={(e) => onNotifyWeeklyChange(e.target.checked)}
              />
              <div className="checkbox-text">
                <span className="checkbox-title">Laporan Analitik Mingguan</span>
                <span className="checkbox-desc">
                  Terima ringkasan performa penjualan setiap hari Senin
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Tombol Aksi Simpan */}
        <div className="settings-actions" style={{ marginTop: '20px' }}>
          <button type="submit" className="btn-save-settings">
            Simpan Perubahan (Simulasi)
          </button>

          {showSaveAlert && (
            <div className="alert-success-dummy">
              <span>✓</span> Pengaturan berhasil disimpan (Simulasi)!
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default SettingsPage
