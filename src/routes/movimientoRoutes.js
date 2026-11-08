const express = require('express');
const router = express.Router();

const {
    obtenerMovimientos,
    obtenerMovimiento,
    registrarMovimiento
} = require('../controllers/movimientoController');

router.get('/', obtenerMovimientos);
router.get('/:id', obtenerMovimiento);
router.post('/', registrarMovimiento);

module.exports = router;
