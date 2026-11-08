const mongoose = require('mongoose');
const Movimiento = require('../models/Movimiento');
const Producto = require('../models/Producto');

// Consultar todos los movimientos
const obtenerMovimientos = async (req, res) => {
    try {
        const movimientos = await Movimiento.find()
            .populate('producto', 'nombre referencia')
            .sort({ createdAt: -1 });

        res.status(200).json(movimientos);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar movimientos',
            error: error.message
        });
    }
};

// Consultar un movimiento por ID
const obtenerMovimiento = async (req, res) => {
    try {
        const movimiento = await Movimiento.findById(req.params.id)
            .populate('producto', 'nombre referencia');

        if (!movimiento) {
            return res.status(404).json({
                mensaje: 'Movimiento no encontrado'
            });
        }

        res.status(200).json(movimiento);

    } catch (error) {
        res.status(400).json({
            mensaje: 'ID de movimiento inválido',
            error: error.message
        });
    }
};

// Registrar una entrada o salida mediante una transacción
const registrarMovimiento = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { producto, tipo, cantidad, observacion } = req.body;

        // Validar campos obligatorios
        if (!producto || !tipo || cantidad === undefined) {
            return res.status(400).json({
                mensaje: 'Producto, tipo y cantidad son obligatorios'
            });
        }

        // Validar tipo de movimiento
        if (!['ENTRADA', 'SALIDA'].includes(tipo)) {
            return res.status(400).json({
                mensaje: 'El tipo debe ser ENTRADA o SALIDA'
            });
        }

        // Validar cantidad
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            return res.status(400).json({
                mensaje: 'La cantidad debe ser un número entero mayor que cero'
            });
        }

        let resultado;

        // Iniciar transacción
        await session.withTransaction(async () => {

            // Buscar producto dentro de la transacción
            const productoEncontrado = await Producto.findById(producto)
                .session(session);

            if (!productoEncontrado) {
                throw Object.assign(
                    new Error('Producto no encontrado'),
                    { statusCode: 404 }
                );
            }

            if (!productoEncontrado.estado) {
                throw Object.assign(
                    new Error('No se pueden registrar movimientos de un producto inactivo'),
                    { statusCode: 400 }
                );
            }

            const stockAnterior = productoEncontrado.stock;
            let stockNuevo;

            // Calcular nuevo stock
            if (tipo === 'ENTRADA') {
                stockNuevo = stockAnterior + cantidad;

            } else {
                if (cantidad > stockAnterior) {
                    throw Object.assign(
                        new Error('Stock insuficiente para realizar la salida'),
                        {
                            statusCode: 400,
                            stockDisponible: stockAnterior
                        }
                    );
                }

                stockNuevo = stockAnterior - cantidad;
            }

            // Actualizar stock
            productoEncontrado.stock = stockNuevo;

            await productoEncontrado.save({ session });

            // Crear registro del movimiento
            const nuevoMovimiento = new Movimiento({
                producto: productoEncontrado._id,
                tipo,
                cantidad,
                stock_anterior: stockAnterior,
                stock_nuevo: stockNuevo,
                observacion
            });

            const movimientoGuardado = await nuevoMovimiento.save({ session });

            // Preparar respuesta
            resultado = {
                movimiento: movimientoGuardado,
                producto: {
                    nombre: productoEncontrado.nombre,
                    stock_anterior: stockAnterior,
                    stock_actual: stockNuevo
                }
            };
        });

        res.status(201).json({
            mensaje: 'Movimiento registrado correctamente',
            movimiento: resultado.movimiento,
            producto: resultado.producto
        });

    } catch (error) {
        console.error('Error al registrar movimiento:', error);

        res.status(error.statusCode || 500).json({
            mensaje: 'No fue posible registrar el movimiento',
            error: error.message,
            ...(error.stockDisponible !== undefined && {
                stockDisponible: error.stockDisponible
            })
        });

    } finally {
        await session.endSession();
    }
};

module.exports = {
    obtenerMovimientos,
    obtenerMovimiento,
    registrarMovimiento
};
