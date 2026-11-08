const Producto = require('../models/Producto');

// Consultar inventario completo
const consultarInventario = async (req, res) => {
    try {
        const productos = await Producto.find({ estado: true })
            .populate('categoria', 'nombre')
            .populate('proveedor', 'nombre')
            .select('nombre referencia stock stock_minimo precio_compra precio_venta categoria proveedor');

        const inventario = productos.map(producto => ({
            id: producto._id,
            nombre: producto.nombre,
            referencia: producto.referencia,
            categoria: producto.categoria,
            proveedor: producto.proveedor,
            stock: producto.stock,
            stock_minimo: producto.stock_minimo,
            precio_compra: producto.precio_compra,
            precio_venta: producto.precio_venta,
            estado_inventario: producto.stock <= producto.stock_minimo
                ? 'STOCK BAJO'
                : 'DISPONIBLE'
        }));

        res.status(200).json({
            total_productos: inventario.length,
            inventario
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar el inventario',
            error: error.message
        });
    }
};

// Consultar productos con stock bajo
const consultarAlertas = async (req, res) => {
    try {
        const productos = await Producto.find({
            estado: true,
            $expr: {
                $lte: ['$stock', '$stock_minimo']
            }
        }).populate('categoria', 'nombre');

        res.status(200).json({
            total_alertas: productos.length,
            alertas: productos.map(producto => ({
                nombre: producto.nombre,
                referencia: producto.referencia,
                stock_actual: producto.stock,
                stock_minimo: producto.stock_minimo,
                categoria: producto.categoria?.nombre
            }))
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar las alertas',
            error: error.message
        });
    }
};

module.exports = {
    consultarInventario,
    consultarAlertas
};
