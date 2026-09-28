function MetricCard({ title, value, trend, isPositive, icon, period = 'vs bulan lalu' }) {
  return (
    <div className="metric-card">
      <div className="metric-card-top">
        <span className="metric-title">{title}</span>
        <span className="metric-icon-badge">{icon}</span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-trend">
        <span className={isPositive ? 'trend-up' : 'trend-down'}>
          {trend}
        </span>
        <span className="trend-caption">{period}</span>
      </div>
    </div>
  )
}

export default MetricCard
