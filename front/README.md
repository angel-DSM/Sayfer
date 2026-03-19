# SAYFER — Gestión Avícola
### Sistema de control e inventario de galpones de pollos de engorde
**Base de datos:** `proyecto_sayfer` | **Backend:** Java Spring Boot

---

## Estructura del proyecto

```
sayfer/
├── index.html        ← Estructura HTML (vistas y modales)
├── css/
│   └── styles.css    ← Estilos y diseño visual
├── js/
│   └── app.js        ← Lógica, llamadas a la API REST
└── README.md         ← Este archivo
```

---

## ⚠️ Por qué no abre directo haciendo doble clic

Cuando abres `index.html` directamente desde el explorador de archivos,
el navegador lo carga con el protocolo `file://`, que **bloquea** la carga
de archivos CSS y JS externos por razones de seguridad.

**Solución:** usar un servidor local. Las dos opciones más fáciles están abajo.

---

## Opción 1 — VS Code + Live Server (recomendado)

### Paso 1 — Instalar VS Code
Si no lo tienes: https://code.visualstudio.com/download

### Paso 2 — Instalar la extensión Live Server
1. Abre VS Code
2. Presiona `Ctrl + Shift + X` (Extensions)
3. Busca **"Live Server"** (autor: Ritwick Dey)
4. Clic en **Install**

### Paso 3 — Abrir el proyecto
1. En VS Code: `Archivo → Abrir Carpeta` → selecciona la carpeta `sayfer/`
2. En el explorador lateral, clic derecho sobre `index.html`
3. Selecciona **"Open with Live Server"**
4. El navegador se abre automáticamente en `http://127.0.0.1:5500`

✅ **Listo. El sistema carga con estilos y funcionalidad completa.**

---

## Opción 2 — Python (sin instalar nada extra)

### Windows
1. Abre la carpeta `sayfer/` en el Explorador de archivos
2. Clic en la barra de direcciones, escribe `cmd`, presiona Enter
3. En la terminal que se abre, ejecuta:
```
python -m http.server 8000
```
4. Abre el navegador en: **http://localhost:8000**

### Mac / Linux
1. Abre la terminal
2. Navega a la carpeta del proyecto:
```bash
cd ruta/a/la/carpeta/sayfer
```
3. Ejecuta:
```bash
python3 -m http.server 8000
```
4. Abre el navegador en: **http://localhost:8000**

---

## Conexión con la API Java

Al ingresar al sistema, en el campo **"URL API"** escribe la dirección
de tu servidor Spring Boot. Ejemplo:

```
http://localhost:8080/api
```

Si la API no responde, el sistema carga **datos de demostración**
automáticamente para que la interfaz funcione durante la presentación.

### Endpoints que consume el frontend

| Método | Endpoint                      | Tabla BD                  |
|--------|-------------------------------|---------------------------|
| GET    | /galpones                     | galpon                    |
| POST   | /galpones                     | galpon                    |
| GET    | /ciclos                       | ciclo_produccion          |
| POST   | /ciclos                       | ciclo_produccion          |
| GET    | /tipos-alimento               | tipo_alimento             |
| POST   | /tipos-alimento               | tipo_alimento             |
| GET    | /stock-alimento               | stok_alimento             |
| GET    | /ingresos-alimento            | ing_alimento              |
| POST   | /ingresos-alimento            | ing_alimento              |
| GET    | /tipos-medicamento            | tipo_medicamento          |
| POST   | /tipos-medicamento            | tipo_medicamento          |
| GET    | /stock-medicamento            | stock_medicamento         |
| GET    | /ingresos-medicamento         | ing_medicamento           |
| POST   | /ingresos-medicamento         | ing_medicamento           |
| GET    | /tipos-muerte                 | tipo_muerte               |
| POST   | /tipos-muerte                 | tipo_muerte               |
| GET    | /mortalidad                   | mortalidad                |
| POST   | /mortalidad                   | mortalidad                |
| GET    | /administracion-alimento      | admi_alimento             |
| POST   | /administracion-alimento      | admi_alimento             |
| GET    | /administracion-medicamento   | admi_medicamento          |
| POST   | /administracion-medicamento   | admi_medicamento          |
| GET    | /usuarios                     | usuario                   |
| POST   | /usuarios                     | usuario                   |
| GET    | /unidades-medida              | unidad_medida             |
| POST   | /unidades-medida              | unidad_medida             |
| GET    | /health                       | (ping de conexión)        |

---

## Tecnologías utilizadas

- **Frontend:** HTML5 · CSS3 · JavaScript (Vanilla)
- **Backend:** Java · Spring Boot
- **Base de datos:** MySQL (`proyecto_sayfer`)
- **Comunicación:** REST API · JSON · Fetch API

---

*SAYFER · proyecto_sayfer · 2026*
