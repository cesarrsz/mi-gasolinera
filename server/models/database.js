const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'siba_gasolinera',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Obtener datos para la web pública
async function getPublicData() {
    try {
        const [pricesRows] = await pool.query('SELECT tipo_combustible, precio FROM precios');
        const [infoRows] = await pool.query('SELECT clave, valor FROM info_general');

        const response = { prices: {} };
        
        pricesRows.forEach(row => {
            response.prices[row.tipo_combustible] = parseFloat(row.precio);
        });

        infoRows.forEach(row => {
            response[row.clave] = row.valor;
        });

        return response;
    } catch (error) {
        console.error("Error base de datos:", error);
        throw error;
    }
}

// Guardar cambios del Admin
async function updateData(data) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Guardar precios
        if (data.prices) {
            for (const [tipo, precio] of Object.entries(data.prices)) {
                await connection.query('UPDATE precios SET precio = ? WHERE tipo_combustible = ?', [precio, tipo]);
            }
        }

        // Guardar textos (horarios, teléfono, etc)
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