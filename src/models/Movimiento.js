const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['ENTRADA', 'SALIDA']
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: 'La cantidad debe ser un número entero'
        }
    },
    stock_anterior: {
        type: Number,
        required: true
    },
    stock_nuevo: {
        type: Number,
        required: true
    },
    observacion: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Movimiento', movimientoSchema);
