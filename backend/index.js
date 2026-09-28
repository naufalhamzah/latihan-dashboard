require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Path direktori build frontend (dist)
const distPath = path.resolve(__dirname, "..", "dist");

// Sajikan file statis dari frontend dist
app.use(express.static(distPath));

// Koneksi MySQL Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "dashboard_db",
  waitForConnections: true,
  connectionLimit: 10,
});

// Endpoint status kesehatan API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Dashboard API berjalan",
  });
});

// Endpoint untuk mengambil transaksi dari MySQL
app.get("/api/transactions", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        DATE_FORMAT(transaction_date, '%Y-%m-%d') AS transaction_date,
        DATE_FORMAT(transaction_date, '%d %b %Y') AS formatted_date,
        customer_name,
        category,
        product_name,
        quantity,
        unit_price,
        quantity * unit_price AS total_amount,
        status
      FROM transactions
      ORDER BY transaction_date DESC, id DESC
    `);

    // Format data agar kompatibel dengan tabel dan komponen UI
    const formatted = rows.map((r) => ({
      ...r,
      customer: r.customer_name,
      product: r.product_name,
      date: r.formatted_date || r.transaction_date,
      amount: `Rp ${Number(r.total_amount).toLocaleString("id-ID")}`,
      statusClass:
        r.status === "Selesai"
          ? "status-success"
          : r.status === "Diproses"
          ? "status-pending"
          : "status-failed",
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Gagal mengambil transaksi:", error.message);
    res.status(500).json({
      message: "Gagal mengambil data transaksi",
      error: error.message,
    });
  }
});

// Handler ringkasan metrik (Summary)
const handleSummary = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) AS total_transactions,
        COALESCE(SUM(quantity * unit_price), 0) AS total_transaction_value,
        COALESCE(SUM(CASE WHEN status = 'Selesai' THEN quantity * unit_price ELSE 0 END), 0) AS completed_revenue,
        COALESCE(SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END), 0) AS completed_transactions,
        COALESCE(SUM(CASE WHEN status = 'Diproses' THEN quantity * unit_price ELSE 0 END), 0) AS processing_revenue,
        COALESCE(SUM(CASE WHEN status = 'Diproses' THEN 1 ELSE 0 END), 0) AS processing_transactions,
        COALESCE(SUM(CASE WHEN status = 'Dibatalkan' THEN quantity * unit_price ELSE 0 END), 0) AS cancelled_revenue,
        COALESCE(SUM(CASE WHEN status = 'Dibatalkan' THEN 1 ELSE 0 END), 0) AS cancelled_transactions
      FROM transactions
    `);

    const data = rows[0];
    const totalTransactions = Number(data.total_transactions) || 0;
    const totalTransactionValue = Number(data.total_transaction_value) || 0;
    const completedRevenue = Number(data.completed_revenue) || 0;
    const completedTransactions = Number(data.completed_transactions) || 0;
    const processingRevenue = Number(data.processing_revenue) || 0;
    const processingTransactions = Number(data.processing_transactions) || 0;
    const cancelledRevenue = Number(data.cancelled_revenue) || 0;
    const cancelledTransactions = Number(data.cancelled_transactions) || 0;

    const averageOrderValue =
      completedTransactions > 0
        ? Math.round(completedRevenue / completedTransactions)
        : 0;

    res.json({
      total_revenue: completedRevenue, // Pendapatan transaksi selesai (realisasi)
      total_transaction_value: totalTransactionValue, // Nilai bruto keseluruhan
      completed_revenue: completedRevenue,
      completed_transactions: completedTransactions,
      total_transactions: totalTransactions,
      processing_revenue: processingRevenue,
      processing_transactions: processingTransactions,
      cancelled_revenue: cancelledRevenue,
      cancelled_transactions: cancelledTransactions,
      average_order_value: averageOrderValue,
      notes: {
        revenue_definition:
          "Pendapatan dihitung dari transaksi berstatus 'Selesai' (quantity * unit_price).",
        cancelled_treatment:
          "Transaksi berstatus 'Dibatalkan' dikeluarkan dari pendapatan terealisasi.",
        unsupported_metrics: [
          "pelanggan_baru",
          "rasio_konversi",
          "pengunjung_unik",
          "retensi_pelanggan",
        ],
      },
    });
  } catch (err) {
    console.error("Gagal mengambil summary:", err.message);
    res.status(500).json({ message: "Gagal mengambil ringkasan dashboard" });
  }
};
app.get("/api/summary", handleSummary);
app.get("/api/dashboard/summary", handleSummary);

// Handler pendapatan bulanan (Monthly)
const handleMonthly = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        DATE_FORMAT(transaction_date, '%Y-%m') AS period,
        DATE_FORMAT(transaction_date, '%b') AS month_name,
        DATE_FORMAT(transaction_date, '%b %Y') AS month_full,
        COALESCE(SUM(quantity * unit_price), 0) AS total_revenue,
        COALESCE(SUM(CASE WHEN status = 'Selesai' THEN quantity * unit_price ELSE 0 END), 0) AS completed_revenue,
        COUNT(*) AS total_orders,
        COALESCE(SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END), 0) AS completed_orders
      FROM transactions
      GROUP BY period, month_name, month_full
      ORDER BY period ASC
    `);

    const result = rows.map((r) => ({
      period: r.period,
      month: r.month_name,
      monthFull: r.month_full,
      revenue: Number(r.completed_revenue),
      gross_revenue: Number(r.total_revenue),
      orders: Number(r.completed_orders),
      total_orders: Number(r.total_orders),
    }));

    res.json(result);
  } catch (err) {
    console.error("Gagal mengambil data bulanan:", err.message);
    res.status(500).json({ message: "Gagal mengambil data bulanan" });
  }
};
app.get("/api/monthly", handleMonthly);
app.get("/api/dashboard/monthly", handleMonthly);

// Handler distribusi kategori produk (Categories)
const CATEGORY_COLORS = {
  "Elektronik & Gadget": "#3b82f6",
  "Peralatan Kantor": "#10b981",
  "Perabot & Furnitur": "#f59e0b",
  "Aksesoris Tambahan": "#8b5cf6",
};
const FALLBACK_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

const handleCategories = async (req, res) => {
  try {
    const [totalRow] = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN status = 'Selesai' THEN quantity * unit_price ELSE 0 END), 0) AS total_completed,
        COALESCE(SUM(quantity * unit_price), 0) AS total_gross
      FROM transactions
    `);
    const total =
      Number(totalRow[0].total_completed) ||
      Number(totalRow[0].total_gross) ||
      1;

    const [rows] = await pool.query(`
      SELECT
        category,
        COALESCE(SUM(CASE WHEN status = 'Selesai' THEN quantity * unit_price ELSE 0 END), 0) AS completed_value,
        COALESCE(SUM(quantity * unit_price), 0) AS gross_value,
        COALESCE(SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END), 0) AS completed_orders,
        COUNT(*) AS total_orders,
        COALESCE(SUM(quantity), 0) AS total_quantity
      FROM transactions
      GROUP BY category
      ORDER BY completed_value DESC, gross_value DESC
    `);

    const result = rows.map((r, idx) => {
      const val = Number(r.completed_value);
      return {
        name: r.category,
        value: val,
        gross_value: Number(r.gross_value),
        orders: Number(r.completed_orders),
        total_orders: Number(r.total_orders),
        total_quantity: Number(r.total_quantity),
        percentage: Number(((val / total) * 100).toFixed(1)),
        color:
          CATEGORY_COLORS[r.category] ||
          FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Gagal mengambil data kategori:", err.message);
    res.status(500).json({ message: "Gagal mengambil data kategori" });
  }
};
app.get("/api/categories", handleCategories);
app.get("/api/dashboard/categories", handleCategories);

// Tangani route API yang tidak dikenal (Mengembalikan JSON 404, BUKAN HTML)
app.use("/api", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Endpoint API '${req.originalUrl}' tidak ditemukan`,
  });
});

// Fallback untuk SPA frontend: semua request non-API mengembalikan index.html
app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});