const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');
const Proveedor = require('../models/Proveedor');
const Movimiento = require('../models/Movimiento');

// Consultar todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const { nombre, categoria, estado } = req.query;

        const filtro = {};

        if (nombre) {
            filtro.nombre = { $regex: nombre, $options: 'i' };
        }

        if (categoria) {
            filtro.categoria = categoria;
        }

        if (estado !== undefined) {
            filtro.estado = estado === 'true';
        }

        const productos = await Producto.find(filtro)
            .populate('categoria', 'nombre')
            .populate('proveedor', 'nombre');

        res.status(200).json(productos);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar productos',
            error: error.message
        });
    }
};

// Consultar un producto por ID
const obtenerProducto = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id)
            .populate('categoria', 'nombre')
            .populate('proveedor', 'nombre');

        if (!producto) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.status(200).json(producto);

    } catch (error) {
        res.status(400).json({
            mensaje: 'ID de producto inválido',
            error: error.message
        });
    }
};

// Registrar un producto
const crearProducto = async (req, res) => {
    try {
        const {
            nombre,
            referencia,
            descripcion,
            precio_compra,
            precio_venta,
            stock_minimo,
            categoria,
            proveedor
        } = req.body;

        // Verificar que la categoría exista
        const categoriaExiste = await Categoria.findById(categoria);

        if (!categoriaExiste || !categoriaExiste.estado) {
            return res.status(400).json({
                mensaje: 'La categoría no existe o está inactiva'
            });
        }

        // Verificar que el proveedor exista, si se proporciona
        if (proveedor) {
            const proveedorExiste = await Proveedor.findById(proveedor);

            if (!proveedorExiste || !proveedorExiste.estado) {
                return res.status(400).json({
                    mensaje: 'El proveedor no existe o está inactivo'
                });
            }
        }

        // El stock inicial siempre será cero.
        // Las existencias se modificarán mediante movimientos.
        const nuevoProducto = new Producto({
            nombre,
            referencia,
            descripcion,
            precio_compra,
            precio_venta,
            stock: 0,
            stock_minimo,
            categoria,
            proveedor
        });

        const productoGuardado = await nuevoProducto.save();

        res.status(201).json({
            mensaje: 'Producto registrado correctamente',
            producto: productoGuardado
        });

    } catch (error) {
        res.status(400).json({
            mensaje: 'No fue posible registrar el producto',
            error: error.message
        });
    }
};

// Actualizar información de un producto
const actualizarProducto = async (req, res) => {
    try {
        // No permitir modificar directamente el stock ni la referencia.
        const {
            stock,
            referencia,
            ...datosActualizacion
        } = req.body;

        if (datosActualizacion.categoria) {
            const categoriaExiste = await Categoria.findById(
                datosActualizacion.categoria
            );

            if (!categoriaExiste || !categoriaExiste.estado) {
                return res.status(400).json({
                    mensaje: 'La categoría no existe o está inactiva'
                });
            }
        }

        if (datosActualizacion.proveedor) {
            const proveedorExiste = await Proveedor.findById(
                datosActualizacion.proveedor
            );

            if (!proveedorExiste || !proveedorExiste.estado) {
                return res.status(400).json({
                    mensaje: 'El proveedor no existe o está inactivo'
                });
            }
        }

        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            datosActualizacion,
            {
                new: true,
                runValidators: true
            }
        );

        if (!producto) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Producto actualizado correctamente',
            producto
        });

    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al actualizar el producto',
            error: error.message
        });
    }
};

// Desactivar un producto
const eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        // No desactivar si existen movimientos registrados.
        const tieneMovimientos = await Movimiento.exists({
            producto: producto._id
        });

        if (tieneMovimientos) {
            return res.status(409).json({
                mensaje: 'No se puede desactivar el producto porque tiene movimientos registrados'
            });
        }

        producto.estado = false;
        await producto.save();

        res.status(200).json({
            mensaje: 'Producto desactivado correctamente',
            producto
        });

    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al desactivar el producto',
            error: error.message
        });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
