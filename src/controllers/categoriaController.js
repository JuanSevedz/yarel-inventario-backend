const Categoria = require('../models/Categoria');
const Producto = require('../models/Producto');

// Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();

        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar las categorías',
            error: error.message
        });
    }
};

// Obtener una categoría por ID
const obtenerCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }

        res.status(200).json(categoria);
    } catch (error) {
        res.status(400).json({
            mensaje: 'ID de categoría inválido',
            error: error.message
        });
    }
};

// Crear una categoría
const crearCategoria = async (req, res) => {
    try {
        const nuevaCategoria = new Categoria(req.body);
        const categoriaGuardada = await nuevaCategoria.save();

        res.status(201).json({
            mensaje: 'Categoría creada correctamente',
            categoria: categoriaGuardada
        });
    } catch (error) {
        res.status(400).json({
            mensaje: 'No fue posible crear la categoría',
            error: error.message
        });
    }
};

// Actualizar una categoría
const actualizarCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!categoria) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            mensaje: 'Categoría actualizada correctamente',
            categoria
        });
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al actualizar la categoría',
            error: error.message
        });
    }
};

// Eliminar una categoría
const eliminarCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }

        // Verificar si existen productos asociados
        const productosAsociados = await Producto.exists({
            categoria: categoria._id
        });

        if (productosAsociados) {
            return res.status(409).json({
                mensaje: 'No es posible eliminar la categoría porque tiene productos asociados'
            });
        }

        await Categoria.findByIdAndDelete(req.params.id);

        res.status(200).json({
            mensaje: 'Categoría eliminada correctamente'
        });

    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al eliminar la categoría',
            error: error.message
        });
    }
};

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};
