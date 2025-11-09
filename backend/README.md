<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🚀 Entorno de Desarrollo Local con Docker

Este proyecto utiliza Docker Compose para crear un entorno de desarrollo local, idéntico y replicable para todos los miembros del equipo. El nombre del proyecto está definido como `slandit` dentro del archivo `docker-compose.yml`.

Con un solo comando, se levantarán los siguientes servicios en segundo plano:
* **PostgreSQL**: Base de datos de autenticación (Puerto: `5432`)
* **MongoDB**: Base de datos principal del foro (Puerto: `27017`)
* **Redis**: Capa de caché (Puerto: `6379`)

La primera vez que se ejecuta, también se poblarán las bases de datos con datos de prueba (usuarios, subforos y publicaciones) para facilitar el desarrollo y las pruebas.

### Prerrequisitos

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.

---

### 1. Primera Ejecución (o si el Seeder cambia)

La primera vez que clones el proyecto, o si alguna vez se modifican los scripts de siembra (en `mongo-seeder` o `postgres-seed`), debes ejecutar:

```bash
docker-compose up -d --build
```

* **`up`**: Inicia todos los contenedores.
* **`-d`** (detached): Ejecuta los contenedores en **segundo plano** y te devuelve el control de la terminal.
* **`--build`**: Le dice a Docker que construya la imagen de nuestro *seeder* (el script que puebla las BDD).

Tus bases de datos quedarán listas y con datos de prueba.

---

### 2. Uso Diario (Iniciar el entorno)

Para cualquier otro día de trabajo, simplemente ejecuta:

```bash
docker-compose up -d
```

Esto iniciará los contenedores en segundo plano. Todos los datos que hayas guardado en tus pruebas anteriores (nuevos usuarios, publicaciones, etc.) **se mantendrán**, ya que se guardan en volúmenes persistentes.

---

### 3. Apagar el Entorno

Cuando termines de trabajar, puedes apagar todo con:

```bash
docker-compose down
```

Esto detiene y *elimina* los contenedores de forma segura. **Tus datos NO se borrarán**, ya que viven en los volúmenes.

---

### 🚨 Cómo Resetear la Base de Datos (¡Cuidado!)

Si en algún momento quieres **borrar todos los datos** y volver al estado inicial (solo con los datos de prueba originales), debes eliminar los volúmenes.

Ejecuta el siguiente comando:

```bash
docker-compose down -v
```

* La bandera `-v` (de *volumes*) elimina los volúmenes de datos.
* La próxima vez que ejecutes `docker-compose up -d --build`, el *seeder* volverá a correr y tendrás una base de datos limpia.