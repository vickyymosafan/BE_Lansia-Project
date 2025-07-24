const mysql = require('mysql2/promise');

// Konfigurasi database MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lansia',
    charset: 'utf8mb4',
    timezone: '+07:00', // WIB timezone
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};

// Buat connection pool untuk optimasi performa
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test koneksi database
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Koneksi database MySQL berhasil');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Gagal koneksi ke database MySQL:', error.message);
        return false;
    }
}

// Fungsi untuk menjalankan query
async function executeQuery(query, params = []) {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

module.exports = {
    pool,
    testConnection,
    executeQuery
};
