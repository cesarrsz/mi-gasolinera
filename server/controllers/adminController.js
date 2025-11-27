const db = require('../models/database');

// 1. Mostrar formulario de Login
exports.showLogin = (req, res) => {
    res.render('login', { error: null });
};

// 2. Procesar Login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    // NOTA: Para este ejemplo usamos texto plano. 
    // En producción idealmente usaríamos bcrypt para comparar hashes.
    try {
        const [rows] = await db.pool.query('SELECT * FROM usuarios_admin WHERE username = ?', [username]);
        
        if (rows.length > 0 && rows[0].password === password) {
            // Guardar sesión
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/admin/dashboard');
        } else {
            res.render('login', { error: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error(error);
        res.send('Error interno del servidor');
    }
};

// 3. Mostrar Dashboard (con los datos actuales cargados)
exports.showDashboard = async (req, res) => {
    if (req.session.loggedin) {
        try {
            const data = await db.getPublicData();
            res.render('dashboard', { data }); // Enviamos los datos a la vista
        } catch (error) {
            res.send('Error cargando datos');
        }
    } else {
        res.redirect('/admin');
    }
};

// 4. Guardar Cambios
exports.updateSettings = async (req, res) => {
    if (!req.session.loggedin) return res.redirect('/admin');

    try {
        // Estructuramos los datos que vienen del formulario
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
        res.redirect('/admin/dashboard'); // Recargar página para ver cambios
    } catch (error) {
        console.error(error);
        res.send('Error guardando cambios');
    }
};

// 5. Cerrar Sesión
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
};