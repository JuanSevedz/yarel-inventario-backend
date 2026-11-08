const express = require('express');
const router = express.Router();

const {
    obtenerProveedores,
    obtenerProveedor,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
} = require('../controllers/proveedorController');

router.get('/', obtenerProveedores);
router.get('/:id', obtenerProveedor);
router.post('/', crearProveedor);
router.put('/:id', actualizarProveedor);
router.delete('/:id', eliminarProveedor);

module.exports = router;
