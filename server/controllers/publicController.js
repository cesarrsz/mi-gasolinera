const db = require('../models/database');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Obtener datos para la web
exports.getData = async (req, res) => {
    try {
        const data = await db.getPublicData();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener datos' });
    }
};

// Enviar correo
exports.sendEmail = async (req, res) => {
    // Configuración básica de transporte (ajusta con tus credenciales reales en .env)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_RECEIVER || 'tu_correo@gmail.com',
        subject: `Mensaje Web de ${req.body.name}`,
        text: req.body.message
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error enviando correo' });
    }
};