const express = require('express');
const session = require('express-session'); // <--- Librería para el login
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Cargar variables de entorno del archivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares (Configuraciones previas) ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Configuración de Sesión (Paso 4: Lo nuevo para el Admin) ---
app.use(session({
    secret: 'siba_secreto_super_seguro', // Cambia esto por algo difícil
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // La sesión dura 1 hora (en milisegundos)
}));

// --- Motor de Plantillas (Para el Panel Admin) ---
app.set('view engine', 'ejs');
// Aseguramos que busque la carpeta 'views' correctamente subiendo un nivel
app.set('views', path.join(__dirname, '../views'));

// --- Archivos Estáticos (Tu página web pública) ---
app.use(express.static(path.join(__dirname, '../public')));
// Servir uploads por si subes imágenes temporalmente
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ... tus imports de rutas
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

// --- INICIO DE TEST ---
console.log('--> CHEQUEO DE RUTAS <--');
console.log('1. Ruta Pública es tipo:', typeof publicRoutes);
console.log('2. Ruta Admin es tipo:', typeof adminRoutes); 
console.log('3. Contenido de Admin:', adminRoutes); 
console.log('-----------------------');
// --- FIN DE TEST ---

// Usar Rutas
app.use('/api', publicRoutes);
app.use('/admin', adminRoutes); // <--- Línea del error


// --- Ruta Principal (Carga tu index.html al entrar a localhost:3000) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});