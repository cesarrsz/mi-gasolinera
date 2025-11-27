const db = require('../models/database');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.getData = async (req, res) => {
    try {
        const data = await db.getPublicData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo datos' });
    }
};

exports.sendEmail = async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const attachments = (req.files || []).map(file => ({
        filename: file.originalname,
        path: file.path
    }));

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_RECEIVER,
        subject: `Nuevo Mensaje Web de: ${req.body.name || 'Cliente'}`,
        html: `
            <h3>Mensaje desde Siba Combustibles Web</h3>
            <p><strong>Nombre:</strong> ${req.body.name}</p>
            <p><strong>Correo:</strong> ${req.body.f_email}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${req.body.message}</p>
        `,
        attachments: attachments
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error enviando correo' });
    }
};