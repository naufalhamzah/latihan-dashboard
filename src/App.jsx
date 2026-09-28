import { useState } from 'react'
import './App.css'
import {
  DUMMY_NAVIGATION,
  PAGE_HEADER_INFO,
} from './data/mockData'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import OverviewPage from './pages/OverviewPage'
import AnalyticsPage from './pages/AnalyticsPage'
import TransactionsPage from './pages/TransactionsPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const [activeMenu, setActiveMenu] = useState('overview');
  const [timeRange, setTimeRange] = useState('30_days');

  // State untuk form Pengaturan
  const [userName, setUserName] = useState('Pengguna Latihan');
  const [userEmail, setUserEmail] = useState('latihan@dashboard.local');
  const [currency, setCurrency] = useState('IDR');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setShowSaveAlert(true);
    setTimeout(() => {
      setShowSaveAlert(false);
    }, 3000);
  };

  const currentHeader = PAGE_HEADER_INFO[activeMenu] || PAGE_HEADER_INFO.overview;

  return (
    <div className="dashboard-layout">
      {/* 1. SIDEBAR NAVIGASI */}
      <Sidebar
        navigationItems={DUMMY_NAVIGATION}
        activeMenu={activeMenu}
        onSelectMenu={setActiveMenu}
        userName={userName}
      />

      {/* 2. AREA KONTEN UTAMA */}
      <div className="dashboard-main">
        {/* HEADER DENGAN JUDUL DINAMIS */}
        <Header
          title={currentHeader.title}
          subtitle={currentHeader.subtitle}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />

        {/* KONTEN HALAMAN TERPISAH */}
        <main className="dashboard-content">
          {activeMenu === 'overview' && (
            <OverviewPage onNavigate={setActiveMenu} />
          )}

          {activeMenu === 'analytics' && (
            <AnalyticsPage />
          )}

          {activeMenu === 'transactions' && (
            <TransactionsPage />
          )}

          {activeMenu === 'settings' && (
            <SettingsPage
              userName={userName}
              onUserNameChange={setUserName}
              userEmail={userEmail}
              onUserEmailChange={setUserEmail}
              currency={currency}
              onCurrencyChange={setCurrency}
              notifyEmail={notifyEmail}
              onNotifyEmailChange={setNotifyEmail}
              notifyWeekly={notifyWeekly}
              onNotifyWeeklyChange={setNotifyWeekly}
              showSaveAlert={showSaveAlert}
              onSave={handleSaveSettings}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
