# Biblioteca API: Node.js + Express + TypeScript + MongoDB

Esta guía construye el proyecto completo: Autenticación de usuario y un CRUD completo para libros, organizado por componentes y capas. El proyecto descargable contiene todos los archivos mostrados a continuación. Usa los  campos JSON `titulo`, `autor`, `anio`, `genero`, and `disponible`; `anio` represents “año”.

## 1. Crear el proyecto

Instalar Node.js 24, que incluye npm. Ver la terminal:

```bash
node --version
npm --version
```

Crear el proyecto:

```bash
mkdir biblioteca-api
cd biblioteca-api
npm init -y
npm install express@5 mongoose@9 bcrypt@6 jsonwebtoken@9 dotenv@17
npm install -D typescript@5 tsx@4 @types/node@24 @types/express@5 @types/bcrypt @types/jsonwebtoken
```

## 2. Crear las carpetas 

```text
biblioteca-api/                 
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json     
├── tsconfig.json
├── README.md
└── src/
    ├── app.ts
    ├── server.ts
    ├── config/
    │   ├── database.ts
    │   └── env.ts
    ├── middlewares/
    │   ├── auth.middleware.ts
    │   └── error.middleware.ts
    ├── shared/
    │   ├── app-error.ts
    │   └── validation.ts
    └── components/
        ├── auth/
        │   ├── auth.routes.ts
        │   ├── auth.controller.ts
        │   └── auth.service.ts
        ├── user/
        │   ├── user.model.ts
        │   └── user.repository.ts
        └── libro/
            ├── libro.model.ts
            ├── libro.repository.ts
            ├── libro.service.ts
            ├── libro.controller.ts
            └── libro.routes.ts
```


## 3. Configurar MongoDB Atlas 

1. Abrir https://www.mongodb.com/atlas y crear una cuenta.
2. Crear un cluster usando la opción gratuita.
3. En la configuración de acceso de la base de datos del proyecto, crear un usuario y una contraseña. Dar permiso al usuario de leer/escribir para la base de datos de la biblioteca.
4. En la lista de acceso de la IP, autorizar la IP de la computadora local.
5. Seleccionar el cluster **Connect → Drivers → Node.js** método de conexión y copiar el URI.
6. Reemplazar el usuario y la contraseña y definir el nombre de la base de datos como `biblioteca`.

El URI se verá de esta forma similar:

```text
mongodb+srv://USUARIO:CLAVE@TU_CLUSTER.mongodb.net/biblioteca?retryWrites=true&w=majority
```

Crear `.env` en la raíz del proyecto:
```dotenv
PORT=3000
MONGO_URI="PASTE_YOUR_COMPLETE_ATLAS_URI_HERE"
JWT_SECRET="PASTE_YOUR_GENERATED_SECRET_HERE"
```

Generar un JWT local, y pegar el resultado en`JWT_SECRET`:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```


  
## 4. Iniciar la API

De la raíz del proyecto con el archivo `.env` configurado:

```bash
npm run dev
```

La salida esperada incluye algo similar a:

```text
MongoDB conectado
API disponible en http://localhost:3000
```

Mantener la terminal abierta. La aplicación comienza a escuchar después de conectarse a MongoDB.



## 5. Prueba de registro y login

Usar Thunder Client para hacer pruebas

Registro con **POST http://localhost:3000/api/auth/register**:
ejemplo:

```json
{
  "nombre": "Juan",
  "email": "juan@example.com",
  "password": "ClaveSegura123!"
}
```

Login con **POST http://localhost:3000/api/auth/login**:
Ejemplo:

```json
{
  "email": "juan@example.com",
  "password": "ClaveSegura123!"
}
```


## 6. Probar el CRUD

| Metodo Http| URL | JWT | Status |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | 201 |
| POST | `/api/auth/login` | No | 200 |
| GET | `/api/libros` | No | 200 |
| GET | `/api/libros/:id` | No | 200 |
| POST | `/api/libros` | Si | 201 |
| PUT | `/api/libros/:id` | Si | 200 |
| DELETE | `/api/libros/:id` | Si | 200 |

### Ejemplo formato libro 
```json
{
  "titulo": "El principito",
  "autor": "Antoine de Saint-Exupery",
  "anio": 1943,
  "genero": "novela",
  "disponible": true
}
```

## 8. Codigos de errores

Errores posibles:
1. Los años tienen que ser un numero entero menor o igual a 2026.
2. El genero solo puede ser `novela`, `cuento`, `poesia`, `ensayo`, `ciencia`, `historia`, o `otro`.
3. Los libros no disponibles no pueden borrarse de la base de datos.
4. Chequeo de formato varios: Longitud de titulo/autor, campos requeridos no completados, JSONs booleanos, propiedades validas, Ids de MongoDB validas, etc.

| Codigo de error | Ejemplos |
| --- | --- |
| 400 | Año "-1", genero desconocido, libro borrado prestado, email duplicado, ID no valida|
| 401 | Credenciales de login no validas; JWT invalido, expirado o formato erroneo |
| 404 | Ruta desconocida, Libro no encontrado |
| 500 | Error de servidor, error de base de datos|


## 9. Capturas de prueba
Se encuentran en el repositorio en la ruta /capturas
