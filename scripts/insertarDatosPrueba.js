require('dotenv').config();

const mongoose = require('mongoose');

const Categoria = require('../src/models/Categoria');
const Proveedor = require('../src/models/Proveedor');
const Producto = require('../src/models/Producto');

const insertarDatosPrueba = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Conectado a MongoDB Atlas');

        // 1. Crear o recuperar categorías
        const categoriasData = [
            {
                nombre: 'Perfumes',
                descripcion: 'Perfumes para hombre y mujer'
            },
            {
                nombre: 'Maquillaje',
                descripcion: 'Productos de maquillaje y belleza'
            },
            {
                nombre: 'Cuidado personal',
                descripcion: 'Productos para el cuidado personal'
            }
        ];

        const categorias = {};

        for (const datos of categoriasData) {
            const categoria = await Categoria.findOneAndUpdate(
                { nombre: datos.nombre },
                { $setOnInsert: datos },
                {
                    returnDocument: 'after',
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert: true
                }
            );

            categorias[datos.nombre] = categoria;
        }

        console.log('Categorías verificadas correctamente');

        // 2. Crear o recuperar proveedores
        const proveedoresData = [
            {
                nombre: 'Distribuidora de prueba',
                nit: '900000001-1',
                telefono: '3000000000',
                correo: 'proveedor1@example.com',
                direccion: 'Garagoa, Boyacá'
            },
            {
                nombre: 'Proveedor de belleza',
                nit: '900000002-2',
                telefono: '3000000001',
                correo: 'proveedor2@example.com',
                direccion: 'Bogotá, Colombia'
            }
        ];

        const proveedores = {};

        for (const datos of proveedoresData) {
            const proveedor = await Proveedor.findOneAndUpdate(
                { nit: datos.nit },
                { $setOnInsert: datos },
                {
                    returnDocument: 'after',
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert: true
                }
            );

            proveedores[datos.nit] = proveedor;
        }

        console.log('Proveedores verificados correctamente');

        // 3. Crear o recuperar productos
        const productosData = [
            {
                nombre: 'Perfume de muestra',
                referencia: 'PER-TEST-001',
                descripcion: 'Producto de prueba para inventario',
                precio_compra: 80000,
                precio_venta: 120000,
                stock: 0,
                stock_minimo: 5,
                categoria: categorias['Perfumes']._id,
                proveedor: proveedores['900000001-1']._id
            },
            {
                nombre: 'Labial de muestra',
                referencia: 'MAQ-TEST-001',
                descripcion: 'Producto de prueba de maquillaje',
                precio_compra: 15000,
                precio_venta: 25000,
                stock: 0,
                stock_minimo: 5,
                categoria: categorias['Maquillaje']._id,
                proveedor: proveedores['900000002-2']._id
            }
        ];

        for (const datos of productosData) {
            await Producto.findOneAndUpdate(
                { referencia: datos.referencia },
                { $setOnInsert: datos },
                {
                    returnDocument: 'after',
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert: true
                }
            );
        }

        console.log('Productos verificados correctamente');

        console.log('\nProceso de inicialización finalizado');
        console.log('Los registros existentes no fueron modificados.');

    } catch (error) {
        console.error('Error al insertar datos de prueba:', error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
    }
};

insertarDatosPrueba();
