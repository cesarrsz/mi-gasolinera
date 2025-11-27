const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Cargar variables de entorno del archivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. Middlewares (Configuración básica) ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. Configuración de Sesión (Para el Login del Admin) ---
app.use(session({
    secret: 'siba_secreto_super_seguro', // Cambia esto en producción
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // La sesión dura 1 hora
}));

// --- 3. Motor de Plantillas (Para el Panel Admin) ---
app.set('view engine', 'ejs');
// Importante: Las vistas están en la carpeta 'views' fuera de 'server'
app.set('views', path.join(__dirname, '../views')); // Busca afuera, en la raíz

// --- 4. Archivos Estáticos (Tu página web pública) ---
app.use(express.static(path.join(__dirname, '../public')));
// Carpeta para archivos subidos temporalmente
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- 5. Importar Rutas ---
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

// --- 6. Usar Rutas ---
app.use('/api', publicRoutes);     // Rutas para datos JSON y correos
app.use('/admin', adminRoutes);    // Rutas del panel de control

// --- 7. Ruta Principal ---
// Si entran a la raíz, mostramos el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// --- 8. Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
});