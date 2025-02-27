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
    "fileId": "<ID_DEL_ARCHIVO>",
    "status": "pending",
    "message": "File <NOMBRE_DEL_ARCHIVO> is uploading.",
  }
  ```

---
### **Obtener datos y errores de un archivo**

**GET** `/files/:fileId?page={n}&perPage={m}`

- **Parámetros:**
  - `fileId` - ID del archivo.
  - `page` (opcional) - Número de página (por defecto: `1`).
  - `perPage` (opcional) - Cantidad de registros por página (por defecto: `100`).
- **Encabezados:**
  - `Authorization: <API_KEY>`
- **Respuesta:**
  ```json
  {
    "fileId": "<ID_DEL_ARCHIVO>",
    "status": "<ESTADO_DEL_ARCHIVO>",
    "totalRows": 200,
    "validData": [
      {
        "nums": [1, 3, 5, 9],
        "row": 2,
        "name": "Carlos",
        "age": 35, 
      }
    ],
    "errors": [
      { 
        "row": 3,
        "col": 1
      }
    ],
  }
  ```


---

##**Ejecución**

1️⃣ **Construir e iniciar los contenedores con Docker Compose**:

```sh
docker-compose build
docker-compose up --no-attach db
```

2️⃣ **Verificar que los servicios estén corriendo**:

```sh
docker ps
```

**Probar la API **

---


