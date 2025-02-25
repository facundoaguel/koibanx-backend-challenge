#KOIBANX BACK-END JUNIOR CHALLENGE

##  **Instalación y configuración**

### **Requisitos previos**

- Docker y Docker Compose
- Variables de entorno configuradas en un archivo `.env`.

###  **Instalación**

```sh
# Clonar el repositorio
git clone <REPO_URL>
cd <PROJECT_FOLDER>

# Construir e iniciar los contenedores con Docker Compose
docker-compose build
docker-compose up -d
```
La API se ejecuta en un contenedor Docker en el puerto **5000** y expone este mismo puerto.
---

##  **Endpoints**

Todos los endpoints comienzan con `/files/` y requieren el uso del header **Authorization** con la API Key.

### **Subir un archivo**

**POST** `/files/upload`
- **Parámetros:**
  - `file` (multipart/form-data) - Archivo Excel a subir.
- **Encabezados:**
  - `Authorization: <API_KEY>`
- **Respuesta:**
  ```json
  {
    "message": "File is being processed",
    "taskId": "<ID_DE_TAREA>"
  }
  ```

---

### **Obtener datos válidos de un archivo**

**GET** `/files/data/:fileId?page={n}&limit={m}`

- **Parámetros:**
  - `fileId` - ID del archivo.
  - `page` (opcional) - Número de página (por defecto: `1`).
  - `limit` (opcional) - Cantidad de registros por página (por defecto: `10`).
- **Encabezados:**
  - `Authorization: <API_KEY>`
- **Respuesta:**
  ```json
  {
    "taskId": "<ID_DE_TAREA>",
    "status": "done",
    "totalData": 50,
    "processedData": [
      { "name": "Juan", "age": 30, "nums": [1, 2, 3, 4] },
      { "name": "Ana", "age": 25, "nums": [5, 6, 7, 8] }
    ],
    "currentPage": 1,
    "totalPages": 5
  }
  ```

---

### **Obtener errores de un archivo**

**GET** `/files/errors/:fileId?page={n}&limit={m}`

- **Descripción:** Obtiene los errores detectados en el procesamiento de un archivo.
- **Parámetros:**
  - `fileId` - ID del archivo.
  - `page` (opcional) - Número de página (por defecto: `1`).
  - `limit` (opcional) - Cantidad de errores por página (por defecto: `10`).
- **Encabezados:**
  - `Authorization: <API_KEY>`
- **Respuesta:**
  ```json
  {
    "taskId": "<ID_DE_TAREA>",
    "status": "done",
    "totalErrors": 10,
    "errors": [
      { "row": 3, "col": 2 },
      { "row": 7, "col": 1 }
    ],
    "currentPage": 1,
    "totalPages": 1
  }
  ```

---

### **Obtener datos y errores de un archivo**

**GET** `/files/:fileId?page={n}&limit={m}`

- **Parámetros:**
  - `fileId` - ID del archivo.
  - `page` (opcional) - Número de página (por defecto: `1`).
  - `limit` (opcional) - Cantidad de registros por página (por defecto: `100`).
- **Encabezados:**
  - `Authorization: <API_KEY>`
- **Respuesta:**
  ```json
  {
    "taskId": "<ID_DE_TAREA>",
    "status": "done",
    "totalRows": 200,
    "data": [
      { "name": "Carlos", "age": 35, "nums": [1, 3, 5, 9], "row": 2 }
    ],
    "errors": [
      { "row": 3, "col": "1" }
    ],
    "currentPage": 1,
    "totalPages": 2
  }
  ```


---

##**Ejecución**

1️⃣ **Construir e iniciar los contenedores con Docker Compose**:

```sh
docker-compose up -d --build
```

2️⃣ **Verificar que los servicios estén corriendo**:

```sh
docker ps
```

**Probar la API **

---


