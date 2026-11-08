const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Importación de rutas
const categoriaRoutes = require('./routes/categoriaRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const productoRoutes = require('./routes/productoRoutes');
const movimientoRoutes = require('./routes/movimientoRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');


// Ruta principal
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de gestión de inventario - Yarel Perfumería',
        estado: 'Funcionando correctamente'
    });
});

// Rutas de la API
app.use('/api/categorias', categoriaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/inventario', inventarioRoutes);


module.exports = app;
