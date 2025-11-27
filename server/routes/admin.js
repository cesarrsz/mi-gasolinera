const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// GET /admin -> Mostrar Login
router.get('/', adminController.showLogin);

// POST /admin/login -> Procesar credenciales
router.post('/login', adminController.login);

// GET /admin/dashboard -> Panel de Control (Protegido)
router.get('/dashboard', adminController.showDashboard);

// POST /admin/update -> Guardar cambios
router.post('/update', adminController.updateSettings);

// GET /admin/logout -> Salir
router.get('/logout', adminController.logout);

module.exports = router;