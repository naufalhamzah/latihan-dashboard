function Header({ title, subtitle, timeRange, onTimeRangeChange }) {
  return (
    <header className="dashboard-header">
      <div className="header-title-group">
        <h1>
          {title}
          <span className="live-badge">MySQL Database</span>
        </h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>

      <div className="header-controls">
        <input
          type="text"
          placeholder="Cari data..."
          className="search-input"
          readOnly
        />
        <select
          className="time-filter"
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
        >
          <option value="7_days">7 Hari Terakhir</option>
          <option value="30_days">30 Hari Terakhir</option>
          <option value="this_year">Tahun Ini</option>
        </select>
      </div>
    </header>
  )
}

export default Header
