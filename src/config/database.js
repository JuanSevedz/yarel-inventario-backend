const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB Atlas conectado correctamente');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = conectarDB;
