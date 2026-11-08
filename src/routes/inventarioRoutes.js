const express = require('express');
const router = express.Router();

const {
    consultarInventario,
    consultarAlertas
} = require('../controllers/inventarioController');

router.get('/', consultarInventario);
router.get('/alertas', consultarAlertas);

module.exports = router;
