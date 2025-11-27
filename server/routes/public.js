const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const multer = require('multer');

// Configuración para subir archivos adjuntos
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo
});

router.get('/data', publicController.getData);
router.post('/send-email', upload.array('attachments'), publicController.sendEmail);

module.exports = router;