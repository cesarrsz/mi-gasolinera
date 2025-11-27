const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const multer = require('multer');

// Configuración para subir archivos (fotos/PDFs)
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB límite
});

// --- RUTAS PÚBLICAS ---

// 1. Obtener datos (Precios, Horarios)
router.get('/data', publicController.getData);

// 2. Enviar correo (Buzón de sugerencias)
router.post('/send-email', upload.array('attachments'), publicController.sendEmail);

// --- ¡ESTA LÍNEA ES OBLIGATORIA! ---
module.exports = router;