const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController'); // Asegúrate de tener este archivo también
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// Rutas
router.get('/data', publicController.getData);
router.post('/send-email', upload.array('attachments'), publicController.sendEmail);

module.exports = router; // <--- ¡Esto es lo más importante!