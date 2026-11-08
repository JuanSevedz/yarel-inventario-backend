require('dotenv').config();

const mongoose = require('mongoose');

const crearIndices = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Conectado a MongoDB Atlas');

        const db = mongoose.connection.db;
        

        // Índice para consultar productos por categoría
        await db.collection('productos').createIndex(
            { categoria: 1 },
            { name: 'idx_producto_categoria' }
        );

        // Índice para consultar productos por proveedor
        await db.collection('productos').createIndex(
            { proveedor: 1 },
            { name: 'idx_producto_proveedor' }
        );

        // Índice para consultar movimientos por producto y fecha
        await db.collection('movimientos').createIndex(
            { producto: 1, createdAt: -1 },
            { name: 'idx_movimiento_producto_fecha' }
        );

        // Índice para consultar movimientos por fecha
        await db.collection('movimientos').createIndex(
            { createdAt: -1 },
            { name: 'idx_movimiento_fecha' }
        );

        console.log('Índices creados correctamente');

    } catch (error) {
        console.error('Error al crear índices:', error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
    }
};

crearIndices();
