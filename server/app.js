const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');

// Cargar configuración
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Sesión de Usuario (Login)
app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto_temporal',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hora
}));

// 3. Configuración de Vistas (Diseño Admin)
app.set('view engine', 'ejs');
// IMPORTANTE: Los dos puntos '..' le dicen que busque la carpeta views AFUERA de server
app.set('views', path.join(__dirname, '../views')); 

// 4. Archivos Públicos (Tu web visible)
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 5. Rutas
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

app.use('/api', publicRoutes);  // Rutas de datos y correo
app.use('/admin', adminRoutes); // Rutas del panel de control

// 6. Ruta Principal (Carga el index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// 7. Iniciar
app.listen(PORT, () => {
    console.log(`✅ Sistema Siba corriendo en: http://localhost:${PORT}`);
});