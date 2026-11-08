require('dotenv').config();

const app = require('./src/app');
const conectarDB = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    await conectarDB();

    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
};

iniciarServidor();
