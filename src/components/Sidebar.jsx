function Sidebar({ navigationItems = [], activeMenu, onSelectMenu, userName }) {
  return (
    <aside className="dashboard-sidebar">
      <div>
        <div className="sidebar-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-text">Latihan Dashboard</span>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => onSelectMenu(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">LP</div>
          <div className="user-details">
            <span className="user-name">{userName}</span>
            <span className="user-role">Mode Pembelajaran</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
