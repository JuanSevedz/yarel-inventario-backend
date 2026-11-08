const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    referencia: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    precio_compra: {
        type: Number,
        required: true,
        min: 0
    },
    precio_venta: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'El stock debe ser un número entero'
        }
    },
    stock_minimo: {
        type: Number,
        default: 5,
        min: 0
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor'
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Producto', productoSchema);
