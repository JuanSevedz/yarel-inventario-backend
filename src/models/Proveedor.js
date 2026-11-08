const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    nit: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    },
    correo: {
        type: String,
        trim: true,
        lowercase: true
    },
    direccion: {
        type: String,
        trim: true
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Proveedor', proveedorSchema);
