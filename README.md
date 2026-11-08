# Yarel Inventario Backend

API REST para la gestión de inventario de **Yarel Perfumería**, desarrollada con Node.js, Express y MongoDB.

El sistema permite administrar productos, categorías y proveedores, registrar entradas y salidas de mercancía, consultar las existencias y detectar productos con niveles de inventario bajos.

---

## 1. Descripción del proyecto

Yarel Inventario Backend es una aplicación del lado del servidor diseñada para apoyar el control de inventario de un establecimiento comercial.

La solución centraliza la información de los productos y sus relaciones con categorías y proveedores. Además, mantiene un historial de movimientos que permite identificar las entradas y salidas de mercancía y consultar los cambios en las existencias.

El proyecto implementa una API REST que permite interactuar con la información mediante solicitudes HTTP.

### Funcionalidades principales

- Gestión de categorías.
- Gestión de proveedores.
- Registro, consulta y actualización de productos.
- Desactivación de productos para conservar la trazabilidad.
- Registro de entradas de inventario.
- Registro de salidas de inventario.
- Consulta del historial de movimientos.
- Consulta general de existencias.
- Identificación de productos con stock bajo.
- Validación de cantidades y disponibilidad de inventario.

---

## 2. Tecnologías utilizadas

| Tecnología | Descripción |
|---|---|
| Node.js | Entorno de ejecución de JavaScript en el servidor. |
| Express | Framework utilizado para construir la API REST. |
| MongoDB Atlas | Sistema gestor de base de datos NoSQL documental. |
| Mongoose | ODM utilizado para modelar documentos y gestionar operaciones con MongoDB. |
| dotenv | Administración de variables de entorno. |
| cors | Middleware para habilitar solicitudes desde otros orígenes. |
| Nodemon | Herramienta para reiniciar automáticamente el servidor durante el desarrollo. |

---

## 3. Requisitos previos

Antes de instalar el proyecto, se debe contar con:

- Node.js instalado.
- npm, incluido con Node.js.
- Una cuenta en MongoDB Atlas.
- Una base de datos configurada en MongoDB Atlas.
- Un usuario de base de datos con permisos de lectura y escritura.
- Acceso a Internet para establecer la conexión con MongoDB Atlas.

Se recomienda utilizar una versión reciente de Node.js compatible con las dependencias del proyecto.

---

## 4. Estructura del proyecto

La organización del código fuente es la siguiente:

```text
yarel-inventario/
│
├── scripts/
│   ├── crearIndices.js
│   └── insertarDatosPrueba.js
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── categoriaController.js
│   │   ├── inventarioController.js
│   │   ├── movimientoController.js
│   │   ├── productoController.js
│   │   └── proveedorController.js
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │   ├── Categoria.js
│   │   ├── Movimiento.js
│   │   ├── Producto.js
│   │   └── Proveedor.js
│   │
│   ├── routes/
│   │   ├── categoriaRoutes.js
│   │   ├── inventarioRoutes.js
│   │   ├── movimientoRoutes.js
│   │   ├── productoRoutes.js
│   │   └── proveedorRoutes.js
│   │
│   └── app.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

### Descripción de los directorios

| Directorio | Responsabilidad |
|---|---|
| `scripts/` | Contiene los scripts para crear índices e inicializar datos de prueba. |
| `src/config/` | Contiene la configuración de conexión con MongoDB. |
| `src/controllers/` | Contiene la lógica de procesamiento de las solicitudes. |
| `src/middleware/` | Espacio destinado a middleware adicionales. |
| `src/models/` | Define los modelos y esquemas de Mongoose. |
| `src/routes/` | Define las rutas y métodos HTTP de la API. |

### Archivos principales

- `server.js`: punto de entrada que establece la conexión y ejecuta el servidor.
- `src/app.js`: configuración de Express y registro de las rutas.
- `package.json`: configuración del proyecto y dependencias.
- `.env.example`: plantilla de las variables de entorno necesarias.
- `.gitignore`: exclusión de archivos que no deben incluirse en el control de versiones.

---

## 5. Modelo de almacenamiento NoSQL

La aplicación utiliza MongoDB, una base de datos documental que almacena la información en colecciones y documentos BSON.

Se definieron cuatro colecciones principales:

### 5.1 Colección `categorias`

Almacena las categorías utilizadas para clasificar los productos.

Atributos principales:

- `nombre`
- `descripcion`
- `estado`
- `createdAt`
- `updatedAt`

### 5.2 Colección `proveedores`

Almacena la información de los proveedores.

Atributos principales:

- `nombre`
- `nit`
- `telefono`
- `correo`
- `direccion`
- `estado`
- `createdAt`
- `updatedAt`

### 5.3 Colección `productos`

Almacena la información de los artículos que conforman el inventario.

Atributos principales:

- `nombre`
- `referencia`
- `descripcion`
- `precio_compra`
- `precio_venta`
- `stock`
- `stock_minimo`
- `categoria`
- `proveedor`
- `estado`
- `createdAt`
- `updatedAt`

Los campos `categoria` y `proveedor` permiten establecer referencias a los documentos correspondientes.

### 5.4 Colección `movimientos`

Registra las operaciones que modifican las existencias de los productos.

Atributos principales:

- `producto`
- `tipo`
- `cantidad`
- `stock_anterior`
- `stock_nuevo`
- `observacion`
- `createdAt`
- `updatedAt`

El atributo `tipo` permite identificar si el movimiento corresponde a una `ENTRADA` o una `SALIDA`.

### Relaciones entre colecciones

- Una categoría puede estar relacionada con varios productos.
- Un proveedor puede estar relacionado con varios productos.
- Un producto puede tener varios movimientos registrados.
- Cada movimiento corresponde a un producto.

Las relaciones se implementan mediante identificadores `ObjectId` y referencias de Mongoose.

---

## 6. Configuración de MongoDB Atlas

La aplicación utiliza MongoDB Atlas como sistema gestor de base de datos.

Para establecer la conexión se requiere una cadena de conexión de MongoDB Atlas.

### Paso 1. Crear la base de datos

Desde MongoDB Atlas:

1. Ingresar a la cuenta.
2. Crear o seleccionar un clúster.
3. Crear un usuario de base de datos.
4. Configurar el acceso de red para permitir la conexión desde el equipo donde se ejecutará la aplicación.
5. Obtener la cadena de conexión del clúster.

### Paso 2. Configurar las variables de entorno

En la raíz del proyecto se encuentra el archivo `.env.example`.

Crear una copia con el nombre `.env` y configurar las variables:

```env
MONGODB_URI=<cadena_de_conexion_de_MongoDB_Atlas>
PORT=3000
```

Reemplazar el valor de `MONGODB_URI` por la cadena de conexión correspondiente.

**Importante:** el archivo `.env` contiene información privada y no debe publicarse en GitHub ni compartirse en el archivo de entrega.

---

## 7. Instalación del proyecto

### Paso 1. Obtener el código fuente

Clonar el repositorio o descargar y descomprimir el archivo del proyecto.

Si se utiliza Git:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar al directorio:

```bash
cd yarel-inventario
```

### Paso 2. Instalar dependencias

Ejecutar:

```bash
npm install
```

Este comando instala las dependencias definidas en `package.json`.

### Paso 3. Configurar MongoDB

Crear el archivo `.env` a partir de `.env.example` y establecer la cadena de conexión de MongoDB Atlas.

### Paso 4. Crear índices

Ejecutar:

```bash
npm run db:indices
```

Este comando ejecuta el script `scripts/crearIndices.js`, encargado de crear índices auxiliares para optimizar determinadas consultas de productos y movimientos.

### Paso 5. Inicializar datos de prueba

Ejecutar:

```bash
npm run db:seed
```

Este comando ejecuta `scripts/insertarDatosPrueba.js` e inicializa categorías, proveedores y productos demostrativos.

El script utiliza operaciones de inserción condicional para evitar modificar los registros que ya existan con las claves de búsqueda utilizadas.

---

## 8. Ejecución del servidor

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Para iniciar el servidor en modo normal:

```bash
npm start
```

La API estará disponible localmente en:

```text
http://localhost:3000
```

La ruta principal:

```http
GET /
```

Permite consultar la respuesta básica de estado de la API.

La URL base de los recursos es:

```text
http://localhost:3000/api
```

---

## 9. Endpoints disponibles

La API cuenta con 20 endpoints distribuidos en cinco recursos principales.

### 9.1 Categorías

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/categorias` | Consultar todas las categorías. |
| GET | `/api/categorias/:id` | Consultar una categoría por identificador. |
| POST | `/api/categorias` | Crear una categoría. |
| PUT | `/api/categorias/:id` | Actualizar una categoría. |
| DELETE | `/api/categorias/:id` | Eliminar una categoría si no tiene productos asociados. |

### 9.2 Proveedores

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/proveedores` | Consultar todos los proveedores. |
| GET | `/api/proveedores/:id` | Consultar un proveedor por identificador. |
| POST | `/api/proveedores` | Crear un proveedor. |
| PUT | `/api/proveedores/:id` | Actualizar un proveedor. |
| DELETE | `/api/proveedores/:id` | Eliminar un proveedor si no tiene productos asociados. |

### 9.3 Productos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/productos` | Consultar los productos. |
| GET | `/api/productos/:id` | Consultar un producto por identificador. |
| POST | `/api/productos` | Registrar un producto. |
| PUT | `/api/productos/:id` | Actualizar los datos de un producto. |
| DELETE | `/api/productos/:id` | Desactivar un producto según las reglas de historial. |

### 9.4 Movimientos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/movimientos` | Consultar el historial de movimientos. |
| GET | `/api/movimientos/:id` | Consultar un movimiento por identificador. |
| POST | `/api/movimientos` | Registrar una entrada o salida de inventario. |

### 9.5 Inventario

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/inventario` | Consultar las existencias de los productos activos. |
| GET | `/api/inventario/alertas` | Consultar los productos que presentan stock bajo. |

---

## 10. Ejemplos de solicitudes

Las solicitudes pueden realizarse mediante herramientas como Postman, Insomnia o extensiones de clientes HTTP.

### 10.1 Crear un producto

**Método:** POST

**Endpoint:**

```http
http://localhost:3000/api/productos
```

**Cuerpo de la solicitud:**

```json
{
  "nombre": "Perfume de prueba",
  "referencia": "PER-001",
  "descripcion": "Producto de demostración",
  "precio_compra": 45000,
  "precio_venta": 65000,
  "stock_minimo": 5,
  "categoria": "<ObjectId_categoria>",
  "proveedor": "<ObjectId_proveedor>"
}
```

El stock inicial se establece en cero. Los identificadores de categoría y proveedor deben corresponder a documentos existentes.

### 10.2 Registrar una entrada de inventario

**Método:** POST

**Endpoint:**

```http
http://localhost:3000/api/movimientos
```

**Cuerpo de la solicitud:**

```json
{
  "producto": "<ObjectId_producto>",
  "tipo": "ENTRADA",
  "cantidad": 5,
  "observacion": "Reposición de mercancía"
}
```

La operación incrementa las existencias y registra el movimiento correspondiente.

### 10.3 Registrar una salida de inventario

**Método:** POST

**Endpoint:**

```http
http://localhost:3000/api/movimientos
```

**Cuerpo de la solicitud:**

```json
{
  "producto": "<ObjectId_producto>",
  "tipo": "SALIDA",
  "cantidad": 2,
  "observacion": "Salida de mercancía"
}
```

La operación disminuye las existencias, siempre que exista suficiente stock disponible.

### 10.4 Consultar el inventario

**Método:** GET

```http
http://localhost:3000/api/inventario
```

Permite consultar los productos activos, sus existencias y su estado de inventario.

### 10.5 Consultar alertas de stock bajo

**Método:** GET

```http
http://localhost:3000/api/inventario/alertas
```

Devuelve los productos cuyo stock es menor o igual al stock mínimo establecido.

---

## 11. Reglas de negocio y validaciones

El sistema contempla las siguientes reglas:

1. La referencia de cada producto debe ser única.
2. El stock debe ser un número entero igual o superior a cero.
3. La cantidad de cada movimiento debe ser un número entero positivo.
4. Los movimientos solo pueden ser de tipo `ENTRADA` o `SALIDA`.
5. No se permiten salidas superiores a las existencias disponibles.
6. El stock se modifica mediante el registro de movimientos, no mediante la actualización ordinaria del producto.
7. Los productos se desactivan cuando corresponde conservar su historial.
8. No se permite eliminar categorías o proveedores que tengan productos asociados.
9. Los movimientos registran el stock anterior y el stock resultante.
10. Las operaciones de registro de movimientos utilizan transacciones de MongoDB para agrupar la actualización del producto y la creación del movimiento.

---

## 12. Scripts disponibles

El proyecto incluye dos scripts principales:

| Script | Comando | Función |
|---|---|---|
| `crearIndices.js` | `npm run db:indices` | Crea índices auxiliares para consultas de productos y movimientos. |
| `insertarDatosPrueba.js` | `npm run db:seed` | Inicializa categorías, proveedores y productos demostrativos. |

Los scripts se encuentran en el directorio `scripts/`.

---

## 13. Manejo de respuestas HTTP

La API utiliza códigos de estado HTTP para comunicar el resultado de las solicitudes.

| Código | Significado |
|---|---|
| 200 | Solicitud procesada correctamente. |
| 201 | Recurso creado correctamente. |
| 400 | Error de validación o solicitud incorrecta. |
| 404 | Recurso no encontrado. |
| 409 | Conflicto con el estado o las relaciones existentes. |
| 500 | Error interno del servidor. |

La respuesta concreta depende de la operación ejecutada y de las validaciones correspondientes.

---

## 14. Consideraciones de seguridad

- No publicar el archivo `.env`.
- No compartir credenciales de MongoDB Atlas.
- Mantener `.env` incluido en `.gitignore`.
- Utilizar `.env.example` como plantilla de configuración.
- Configurar adecuadamente las reglas de acceso de red de MongoDB Atlas.
- No incluir `node_modules` en el repositorio ni en el archivo comprimido de entrega.

---

## 15. Alcance del proyecto

El desarrollo corresponde a un backend que proporciona servicios para la gestión básica del inventario.

No incluye una interfaz gráfica, autenticación de usuarios, administración de roles ni integración con sistemas de facturación o ventas.

La solución constituye una base funcional que puede ampliarse posteriormente con nuevas características y mecanismos adicionales de seguridad.

---

## 16. Autor

**Aprendiz:** Juan Sebastián Vega Díaz

**Formación:** Desarrollo Backend con Node.js y MongoDB

**Evidencia:** AA2-EV01 – Código fuente API RestFull y Scripts BD.

**Proyecto:** Yarel Inventario Backend

**Entidad de formación:** Servicio Nacional de Aprendizaje – SENA.