const db = require('../models/database');

exports.showLogin = (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/admin/dashboard');
    } else {
        res.render('login', { error: null });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    // NOTA: Usuario y contraseña quemados para prueba rápida.
    // Puedes cambiarlos aquí o usar la base de datos.
    if (username === 'admin' && password === 'admin123') {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/admin/dashboard');
    } else {
        res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }
};

exports.showDashboard = async (req, res) => {
    if (req.session.loggedin) {
        try {
            const data = await db.getPublicData();
            res.render('dashboard', { data });
        } catch (error) {
            res.send('Error cargando datos de la base de datos.');
        }
    } else {
        res.redirect('/admin');
    }
};

exports.updateSettings = async (req, res) => {
    if (!req.session.loggedin) return res.redirect('/admin');

    try {
        const updateData = {
            prices: {
                magna: req.body.magna,
                premium: req.body.premium,
                diesel: req.body.diesel
            },
            slogan: req.body.slogan,
            phone: req.body.phone,
            email: req.body.email,
            pump_hours: req.body.pump_hours,
            office_morning: req.body.office_morning,
            office_afternoon: req.body.office_afternoon,
            office_lunch: req.body.office_lunch
        };

        await db.updateData(updateData);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.send('Error al guardar cambios.');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
};