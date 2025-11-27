const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Mostrar Login
router.get('/', adminController.showLogin);

// Procesar Login (POST)
router.post('/login', adminController.login);

// Panel Principal (Dashboard)
router.get('/dashboard', adminController.showDashboard);

// Guardar Cambios
router.post('/update', adminController.updateSettings);

// Cerrar Sesión
router.get('/logout', adminController.logout);

module.exports = router;