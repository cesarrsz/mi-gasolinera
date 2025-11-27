const mysql = require('mysql2/promise');
const config = require('../config/default.json'); // Asegúrate que este archivo existe o usa process.env

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: config.db.host || process.env.DB_HOST || 'localhost',
    user: config.db.user || process.env.DB_USER || 'root',
    password: config.db.password || process.env.DB_PASS || '',
    database: config.db.database || process.env.DB_NAME || 'siba_gasolinera',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Función para obtener toda la info pública
async function getPublicData() {
    try {
        // Obtener precios
        const [pricesRows] = await pool.query('SELECT tipo_combustible, precio FROM precios');
        // Obtener info general
        const [infoRows] = await pool.query('SELECT clave, valor FROM info_general');

        const response = { prices: {} };
        
        // Convertir precios a objeto { magna: 23.99, ... }
        pricesRows.forEach(row => {
            response.prices[row.tipo_combustible] = parseFloat(row.precio);
        });

        // Convertir info a claves { slogan: "...", phone: "..." }
        infoRows.forEach(row => {
            response[row.clave] = row.valor;
        });

        return response;
    } catch (error) {
        console.error("Error en getPublicData:", error);
        throw error;
    }
}

// Función para actualizar datos (Admin)
async function updateData(data) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Actualizar precios
        if (data.prices) {
            for (const [tipo, precio] of Object.entries(data.prices)) {
                await connection.query('UPDATE precios SET precio = ? WHERE tipo_combustible = ?', [precio, tipo]);
            }
        }

        // Actualizar textos generales
        const keys = ['slogan', 'phone', 'email', 'pump_hours', 'office_morning', 'office_afternoon', 'office_lunch'];
        for (const key of keys) {
            if (data[key] !== undefined) {
                await connection.query('UPDATE info_general SET valor = ? WHERE clave = ?', [data[key], key]);
            }
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = { pool, getPublicData, updateData };