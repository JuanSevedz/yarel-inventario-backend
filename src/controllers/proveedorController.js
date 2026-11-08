const Proveedor = require('../models/Proveedor');
const Producto = require('../models/Producto');

// Obtener todos los proveedores
const obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.find();

        res.status(200).json(proveedores);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar proveedores',
            error: error.message
        });
    }
};

// Obtener un proveedor por ID
const obtenerProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);

        if (!proveedor) {
            return res.status(404).json({
                mensaje: 'Proveedor no encontrado'
            });
        }

        res.status(200).json(proveedor);
    } catch (error) {
        res.status(400).json({
            mensaje: 'ID de proveedor inválido',
            error: error.message
        });
    }
};

// Crear un proveedor
const crearProveedor = async (req, res) => {
    try {
        const nuevoProveedor = new Proveedor(req.body);
        const proveedorGuardado = await nuevoProveedor.save();

        res.status(201).json({
            mensaje: 'Proveedor creado correctamente',
            proveedor: proveedorGuardado
        });
    } catch (error) {
        res.status(400).json({
            mensaje: 'No fue posible crear el proveedor',
            error: error.message
        });
    }
};

// Actualizar un proveedor
const actualizarProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!proveedor) {
            return res.status(404).json({
                mensaje: 'Proveedor no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Proveedor actualizado correctamente',
            proveedor
        });
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al actualizar proveedor',
            error: error.message
        });
    }
};

// Eliminar un proveedor
const eliminarProveedor = async (req, res) => {
    try {
        const productosAsociados = await Producto.exists({
            proveedor: req.params.id
        });

        if (productosAsociados) {
            return res.status(409).json({
                mensaje: 'No se puede eliminar el proveedor porque tiene productos asociados'
            });
        }

        const proveedor = await Proveedor.findByIdAndDelete(req.params.id);

        if (!proveedor) {
            return res.status(404).json({
                mensaje: 'Proveedor no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Proveedor eliminado correctamente'
        });
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al eliminar proveedor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerProveedores,
    obtenerProveedor,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
};
