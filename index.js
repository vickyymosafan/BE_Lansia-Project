const express = require('express');
// const cors = require('cors');
const { testConnection, executeQuery } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors({
//     origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
//     credentials: true
// }));

// Manual CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Test endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server berjalan dengan baik',
        timestamp: new Date().toISOString()
    });
});

// Endpoint untuk membuat profil baru dengan pemeriksaan pertama
app.post('/api/profiles', async (req, res) => {
    const { nama, usia, alamat, riwayat_medis, tekanan_darah, gula_darah, catatan } = req.body;
    
    try {
        // Validasi input
        if (!nama || !usia || !alamat || !tekanan_darah || !gula_darah) {
            return res.status(400).json({ 
                error: 'Data wajib tidak lengkap',
                required: ['nama', 'usia', 'alamat', 'tekanan_darah', 'gula_darah']
            });
        }

        // Insert profil baru
        const profileQuery = `
            INSERT INTO profiles (nama, usia, alamat, riwayat_medis) 
            VALUES (?, ?, ?, ?)
        `;
        const profileResult = await executeQuery(profileQuery, [
            nama, 
            parseInt(usia), 
            alamat, 
            riwayat_medis || ''
        ]);

        const profileId = profileResult.insertId;

        // Insert pemeriksaan pertama
        const checkupQuery = `
            INSERT INTO checkups (profile_id, tekanan_darah, gula_darah, catatan) 
            VALUES (?, ?, ?, ?)
        `;
        await executeQuery(checkupQuery, [
            profileId, 
            tekanan_darah, 
            parseInt(gula_darah),
            catatan || ''
        ]);

        res.status(201).json({ 
            id: profileId, 
            message: 'Profil dan pemeriksaan berhasil disimpan',
            data: {
                profile_id: profileId,
                nama,
                usia: parseInt(usia)
            }
        });

    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ 
            error: 'Gagal menyimpan data ke database',
            details: error.message 
        });
    }
});

// Endpoint untuk mendapatkan profil dan riwayat pemeriksaan
app.get('/api/profiles/:id', async (req, res) => {
    const profileId = req.params.id;
    
    try {
        // Ambil data profil
        const profileQuery = 'SELECT * FROM profiles WHERE id = ?';
        const profileResult = await executeQuery(profileQuery, [profileId]);
        
        if (profileResult.length === 0) {
            return res.status(404).json({ error: 'Profil tidak ditemukan' });
        }

        // Ambil riwayat pemeriksaan
        const checkupsQuery = `
            SELECT * FROM checkups 
            WHERE profile_id = ? 
            ORDER BY tanggal DESC
        `;
        const checkupsResult = await executeQuery(checkupsQuery, [profileId]);

        res.json({
            profile: profileResult[0],
            checkups: checkupsResult
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ 
            error: 'Gagal mengambil data dari database',
            details: error.message 
        });
    }
});

// Endpoint untuk menambah pemeriksaan baru
app.post('/api/checkups', async (req, res) => {
    const { profile_id, tekanan_darah, gula_darah, catatan } = req.body;
    
    try {
        // Validasi input
        if (!profile_id || !tekanan_darah || !gula_darah) {
            return res.status(400).json({ 
                error: 'Data wajib tidak lengkap',
                required: ['profile_id', 'tekanan_darah', 'gula_darah']
            });
        }

        // Cek apakah profil ada
        const profileCheck = await executeQuery('SELECT id FROM profiles WHERE id = ?', [profile_id]);
        if (profileCheck.length === 0) {
            return res.status(404).json({ error: 'Profil tidak ditemukan' });
        }

        // Insert pemeriksaan baru
        const checkupQuery = `
            INSERT INTO checkups (profile_id, tekanan_darah, gula_darah, catatan) 
            VALUES (?, ?, ?, ?)
        `;
        const result = await executeQuery(checkupQuery, [
            profile_id, 
            tekanan_darah, 
            parseInt(gula_darah),
            catatan || ''
        ]);

        res.status(201).json({ 
            id: result.insertId,
            message: 'Pemeriksaan berhasil ditambahkan',
            data: {
                checkup_id: result.insertId,
                profile_id,
                tekanan_darah,
                gula_darah: parseInt(gula_darah)
            }
        });

    } catch (error) {
        console.error('Error adding checkup:', error);
        res.status(500).json({ 
            error: 'Gagal menambah pemeriksaan',
            details: error.message 
        });
    }
});

// Endpoint untuk mendapatkan semua profil (untuk admin/testing)
app.get('/api/profiles', async (req, res) => {
    try {
        const query = `
            SELECT p.*, 
                   COUNT(c.id) as total_checkups,
                   MAX(c.tanggal) as last_checkup
            FROM profiles p 
            LEFT JOIN checkups c ON p.id = c.profile_id 
            GROUP BY p.id 
            ORDER BY p.created_at DESC
        `;
        const result = await executeQuery(query);
        
        res.json({
            profiles: result,
            total: result.length
        });

    } catch (error) {
        console.error('Error fetching all profiles:', error);
        res.status(500).json({ 
            error: 'Gagal mengambil data profil',
            details: error.message 
        });
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Terjadi kesalahan server',
        message: err.message 
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Endpoint tidak ditemukan',
        path: req.originalUrl 
    });
});

// Start server
async function startServer() {
    try {
        // Test database connection
        const dbConnected = await testConnection();
        if (!dbConnected) {
            console.error('❌ Gagal koneksi database. Server tidak dapat dimulai.');
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
            console.log(`📋 API Documentation:`);
            console.log(`   POST /api/profiles - Buat profil baru`);
            console.log(`   GET  /api/profiles/:id - Ambil profil dan riwayat`);
            console.log(`   POST /api/checkups - Tambah pemeriksaan baru`);
            console.log(`   GET  /api/profiles - Ambil semua profil`);
        });

    } catch (error) {
        console.error('❌ Gagal memulai server:', error);
        process.exit(1);
    }
}

startServer();
