import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'

// Fungsi pemformat Rupiah
const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

// Tooltip kustom untuk Pie/Donut Chart
function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="custom-chart-tooltip">
        <p className="tooltip-title">{data.name}</p>
        <p className="tooltip-value">
          <span
            className="tooltip-dot"
            style={{ backgroundColor: data.color || '#3b82f6' }}
          ></span>
          Nilai: <strong>{formatRupiah(data.value)}</strong>
        </p>
        <p className="tooltip-sub">
          Pangsa Pasar: <strong>{data.percentage}%</strong> ({data.orders} pesanan)
        </p>
      </div>
    )
  }
  return null
}

function CategoryPieChart({ data = [], height = 240 }) {
  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={4}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryPieChart
