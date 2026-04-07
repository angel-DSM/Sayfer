# Manual de Usuario — SAYFER
## Sistema de Gestión Avícola
**Versión Beta 0.0.1**

---

## Tabla de Contenido

1. [Introducción](#1-introducción)
2. [Requisitos del Sistema](#2-requisitos-del-sistema)
3. [Acceso al Sistema](#3-acceso-al-sistema)
4. [Interfaz General](#4-interfaz-general)
5. [Dashboard General](#5-dashboard-general)
6. [Galpones](#6-galpones)
7. [Ciclos de Producción](#7-ciclos-de-producción)
8. [Inventario de Alimento](#8-inventario-de-alimento)
9. [Inventario de Medicamentos](#9-inventario-de-medicamentos)
10. [Administración de Alimento](#10-administración-de-alimento)
11. [Administración de Medicamentos](#11-administración-de-medicamentos)
12. [Registro de Mortalidad](#12-registro-de-mortalidad)
13. [Usuarios del Sistema](#13-usuarios-del-sistema)
14. [Reporte PDF](#14-reporte-pdf)
15. [Configuración](#15-configuración)
16. [Roles y Permisos](#16-roles-y-permisos)
17. [Preguntas Frecuentes](#17-preguntas-frecuentes)

---

## 1. Introducción

**SAYFER** (Sistema de Gestión Avícola) es una aplicación web diseñada para facilitar el control y seguimiento integral de granjas avícolas. Permite gestionar galpones, ciclos de producción, inventarios de alimento y medicamentos, registro de mortalidad y generación de reportes contables, todo desde un único lugar.

### Propósito del sistema
- Llevar un control preciso del inventario de insumos (alimento y medicamentos).
- Registrar y analizar la mortalidad de aves por ciclo de producción.
- Calcular los costos acumulados por ciclo para apoyar la toma de decisiones.
- Generar reportes en PDF con información operativa y contable.

---

## 2. Requisitos del Sistema

| Componente | Requisito |
|---|---|
| Navegador | Chrome, Firefox, Edge o Safari (versión reciente) |
| Conexión | Red local o internet con acceso al servidor |
| Resolución | 1024×768 px mínimo recomendado |
| JavaScript | Habilitado en el navegador |

No se requiere instalar ningún software adicional en el equipo del usuario.

---

## 3. Acceso al Sistema

### 3.1 Iniciar sesión

1. Abrir el navegador e ingresar la dirección del sistema.
2. En la pantalla de inicio de sesión ingresar:
   - **Correo electrónico** registrado en el sistema.
   - **Contraseña** asignada.
3. Hacer clic en **Iniciar Sesión**.

> Si las credenciales son incorrectas, el sistema mostrará un mensaje de error. Verificar que el correo y la contraseña estén escritos correctamente.

### 3.2 Recuperar contraseña

En la pantalla de inicio de sesión, hacer clic en **¿Olvidaste tu contraseña?** e ingresar el correo electrónico registrado. El sistema enviará un enlace de recuperación al correo indicado.

### 3.3 Cerrar sesión

Hacer clic en el avatar o nombre de usuario ubicado en la parte superior derecha de la pantalla y seleccionar **Cerrar sesión**.

---

## 4. Interfaz General

La interfaz principal está compuesta por:

- **Barra superior**: muestra el nombre del sistema, el usuario activo y el botón de cierre de sesión.
- **Menú de navegación lateral**: permite acceder a todas las secciones del sistema.
- **Área de contenido**: zona principal donde se visualizan tablas, gráficas y formularios.

### Navegación
Hacer clic en cualquier elemento del menú lateral para cambiar de sección. La sección activa se resalta visualmente.

### Elementos comunes

| Elemento | Descripción |
|---|---|
| Botón **+ Nuevo** | Abre el formulario para registrar un nuevo elemento |
| Ícono ✏️ | Abre el formulario de edición del registro seleccionado |
| Campo de búsqueda | Filtra los registros de la tabla en tiempo real |
| Botón **Actualizar** | Recarga los datos de la sección actual |
| **Badges de estado** | Indicadores visuales: verde = activo, gris = cerrado |

### Tema visual
El sistema soporta modo claro y modo oscuro. Se puede cambiar desde la sección **Configuración**.

---

## 5. Dashboard General

El Dashboard es la pantalla de inicio del sistema. Muestra un resumen del estado actual de la granja.

### 5.1 Tarjetas de estadísticas

| Tarjeta | Información mostrada |
|---|---|
| Galpones registrados | Total de galpones en el sistema |
| Ciclos activos | Número de ciclos de producción en curso |
| Aves en producción | Total de pollos activos (suma de todos los ciclos activos) |
| Bajas registradas hoy | Número de muertes registradas en el día actual |
| Tipos de alimento | Cantidad de tipos de alimento configurados |
| Tipos de medicamento | Cantidad de tipos de medicamento configurados |

### 5.2 Alertas automáticas

El sistema genera alertas visibles en la parte superior del dashboard en los siguientes casos:

- **Stock crítico de alimento**: cuando el inventario de un tipo de alimento es inferior a 100 kg.
- **Medicamento bajo**: cuando el stock de un medicamento es inferior a 5 unidades.
- **Producto por vencer**: cuando un alimento o medicamento vence en los próximos 30 días (alerta amarilla).
- **Producto vencido**: cuando la fecha de vencimiento ya fue superada (alerta roja).

### 5.3 Gráficas del dashboard

- **Mortalidad por ciclo activo**: gráfico de barras con el total de bajas registradas por cada ciclo en curso.
- **Stock de alimentos**: barras de progreso con el nivel actual de inventario por tipo de alimento.
- **Stock de medicamentos**: barras de progreso con el nivel de stock por medicamento.

### 5.4 Tabla de ciclos

Muestra todos los ciclos de producción registrados con su estado (activo o cerrado), galpón asignado y fechas.

---

## 6. Galpones

Los galpones representan las instalaciones físicas donde se crían las aves.

### 6.1 Ver galpones

Al ingresar a la sección **Galpones** se muestra una tabla con todos los galpones registrados:

| Columna | Descripción |
|---|---|
| ID | Identificador único del galpón |
| Nombre | Nombre asignado al galpón |
| Capacidad | Número máximo de aves que puede albergar |
| Ciclos asociados | Cantidad de ciclos de producción vinculados |

### 6.2 Registrar un nuevo galpón *(solo Administrador)*

1. Hacer clic en **+ Nuevo Galpón**.
2. Completar el formulario:
   - **Nombre**: nombre descriptivo del galpón (ej: "Galpón Norte").
   - **Metros cuadrados**: área del galpón. El sistema sugerirá automáticamente una capacidad basada en 10 aves/m².
   - **Capacidad**: número máximo de aves (se puede ajustar manualmente).
3. Hacer clic en **Guardar**.

> Si la capacidad ingresada supera 10 aves/m², el sistema mostrará una advertencia, aunque permite continuar.

### 6.3 Editar o eliminar un galpón *(solo Administrador)*

Hacer clic en el ícono ✏️ del galpón deseado. Desde el formulario de edición se pueden modificar los datos o eliminar el galpón haciendo clic en **Eliminar**.

> No se puede eliminar un galpón que tenga ciclos de producción activos asociados.

---

## 7. Ciclos de Producción

Un ciclo de producción representa un lote de aves desde su ingreso hasta su venta o finalización.

### 7.1 Ver ciclos

La tabla muestra todos los ciclos con:

| Columna | Descripción |
|---|---|
| ID | Identificador único |
| Nombre | Nombre del ciclo (ej: "Lote A-2026") |
| Galpón | Galpón(es) vinculados |
| Fecha Inicio | Fecha de inicio del ciclo |
| Fecha Fin | Fecha de cierre (vacío si está activo) |
| Duración | Días transcurridos o totales |
| Pollos | Cantidad de aves con las que inició el ciclo |
| Estado | Activo o Cerrado |

Debajo de la tabla se muestra la sección **Costo acumulado — ciclos activos** con el desglose de inversión por ciclo en curso.

### 7.2 Iniciar un nuevo ciclo *(solo Administrador)*

1. Hacer clic en **+ Nuevo Ciclo**.
2. Completar el formulario:
   - **Nombre del Ciclo**: identificador descriptivo del lote.
   - **Fecha Inicio**: fecha en que ingresan las aves.
   - **Fecha Fin** *(opcional)*: dejar vacío si el ciclo está en curso.
   - **Cantidad de pollos**: número de aves que ingresan al ciclo.
   - **Valor por pollo (COP)**: precio de compra por ave. Este dato se usa para calcular la inversión inicial y la pérdida por mortalidad.
   - **Galpones**: seleccionar uno o varios galpones. Los galpones que ya tienen un ciclo activo aparecen bloqueados.
3. Hacer clic en **Crear Ciclo**.

### 7.3 Editar o cerrar un ciclo *(solo Administrador)*

Hacer clic en ✏️ junto al ciclo. Para cerrar un ciclo, ingresar la **Fecha Fin**. También se pueden modificar la cantidad de pollos, el valor por pollo y los galpones vinculados.

### 7.4 Costo acumulado por ciclo

El sistema calcula automáticamente el costo total invertido en cada ciclo activo:

- **Inversión en pollos**: cantidad de pollos × valor por pollo.
- **Costo de alimento**: basado en el precio promedio histórico de cada tipo de alimento multiplicado por la cantidad consumida.
- **Costo de medicamentos**: basado en el precio promedio histórico de cada medicamento multiplicado por la cantidad aplicada.

---

## 8. Inventario de Alimento

Gestiona el stock de alimento disponible en la granja.

### 8.1 Tipos de alimento

Antes de registrar ingresos, deben existir tipos de alimento configurados. Cada tipo tiene:

| Campo | Descripción |
|---|---|
| Nombre comercial | Nombre del producto (ej: "Contegral Inicio Plus") |
| Categoría | Etapa del ciclo: preiniciador, iniciador, engorde, finalización |
| Descripción | Información adicional del producto |

Para agregar un tipo, hacer clic en **+ Nuevo Tipo de Alimento** y completar el formulario.

### 8.2 Registrar ingreso de alimento *(solo Administrador)*

Cada vez que se compra alimento y llega a la granja, se registra un ingreso:

1. Hacer clic en **+ Registrar Ingreso**.
2. Completar el formulario:
   - **Tipo de alimento**: seleccionar de la lista de tipos registrados.
   - **Cantidad (kg)**: kilos recibidos.
   - **Valor unitario (COP/kg)**: precio de compra por kilogramo.
   - **Fecha de ingreso**: fecha de recepción.
   - **Fecha de vencimiento**: fecha límite de uso del producto.
3. El campo **Valor total** se calcula automáticamente (cantidad × valor unitario).
4. Hacer clic en **Guardar**.

### 8.3 Stock actual

La sección de **Stock** muestra el inventario disponible de cada tipo de alimento (en kg). El sistema actualiza el stock descontando el alimento administrado a los ciclos.

---

## 9. Inventario de Medicamentos

Funciona de manera similar al inventario de alimento.

### 9.1 Tipos de medicamento

Cada tipo de medicamento incluye:

| Campo | Descripción |
|---|---|
| Nombre | Nombre del producto (ej: "Enrofloxacina 10%") |
| Categoría | Tipo de producto: vacuna, antibiótico, vitamínico, desparasitante |
| Unidad | Unidad de medida: ml, g, dosis, etc. |
| Período de retiro | Días que deben transcurrir antes del sacrificio tras su aplicación |
| Condiciones de almacenamiento | Indicaciones de conservación |

### 9.2 Registrar ingreso de medicamento *(solo Administrador)*

1. Hacer clic en **+ Registrar Ingreso**.
2. Completar: tipo de medicamento, cantidad, valor total, fecha de ingreso y fecha de vencimiento.
3. Hacer clic en **Guardar**.

---

## 10. Administración de Alimento

Registra el alimento suministrado a las aves en cada ciclo de producción.

### 10.1 Registrar suministro de alimento *(solo Administrador)*

1. Hacer clic en **+ Registrar Alimentación**.
2. Completar el formulario:
   - **Tipo de alimento**: producto suministrado.
   - **Cantidad utilizada (kg)**: kilos entregados al lote.
   - **Fecha**: día del suministro.
   - **Galpón**: instalación donde se aplicó.
   - **Ciclo**: ciclo de producción correspondiente.
3. Hacer clic en **Guardar**.

### 10.2 Gráficas de consumo

La sección muestra dos gráficas agrupadas:

- **Ciclos activos**: para cada ciclo activo, una barra por tipo de alimento con los kg consumidos.
- **Ciclos finalizados**: mismo formato para los ciclos ya cerrados.

---

## 11. Administración de Medicamentos

Registra la aplicación de medicamentos a las aves.

### 11.1 Registrar aplicación *(solo Administrador)*

1. Hacer clic en **+ Registrar Aplicación**.
2. Completar:
   - **Medicamento**: producto aplicado.
   - **Cantidad**: dosis o volumen aplicado (en la unidad del medicamento).
   - **Fecha de medicación**: día de la aplicación.
   - **Galpón** y **Ciclo** correspondientes.
3. Hacer clic en **Guardar**.

---

## 12. Registro de Mortalidad

Permite registrar y analizar las bajas de aves en cada ciclo.

### 12.1 Estadísticas de mortalidad

En la parte superior de la sección se muestran cuatro indicadores:

| Indicador | Descripción |
|---|---|
| Total bajas registradas | Suma total de muertes en todos los ciclos |
| Bajas hoy | Muertes registradas en el día actual |
| Galpones afectados | Número de galpones con al menos una baja |
| Tasa de mortalidad | Porcentaje global de bajas sobre el total de aves registradas |

### 12.2 Tasa de mortalidad por ciclo

La tabla **Tasa de mortalidad por ciclo** muestra por cada ciclo:

| Columna | Descripción |
|---|---|
| Ciclo | Nombre del ciclo |
| Pollos iniciales | Cantidad de aves al inicio del ciclo |
| Bajas totales | Suma de muertes registradas en el ciclo |
| Tasa | Porcentaje de bajas sobre pollos iniciales |

**Interpretación de la tasa:**
- 🟢 **< 3%**: mortalidad normal.
- 🟡 **3% – 6%**: requiere atención.
- 🔴 **≥ 6%**: nivel crítico, se recomienda revisión veterinaria.

### 12.3 Registrar una baja *(solo Administrador)*

1. Hacer clic en **+ Registrar Baja**.
2. Completar:
   - **Cantidad de muertos**: número de aves muertas en el evento.
   - **Fecha**: día en que ocurrió la muerte.
   - **Causa**: descripción breve de la causa.
   - **Tipo de muerte**: seleccionar de la lista de tipos configurados (ej: enfermedad respiratoria, aplastamiento).
   - **Galpón** y **Ciclo** donde ocurrió.
3. Hacer clic en **Guardar**.

### 12.4 Gráficas de mortalidad

La sección incluye cuatro gráficas:

- **Por tipo de causa**: bajas agrupadas por tipo de muerte.
- **Por mes**: evolución mensual del número de bajas.
- **Por ciclo de producción**: total de bajas por ciclo.
- **Bajas por tipo — ciclos activos / finalizados**: gráficas agrupadas mostrando tipos de muerte por ciclo.

---

## 13. Usuarios del Sistema

*(Disponible solo para Administradores)*

Permite gestionar las cuentas de acceso al sistema.

### 13.1 Ver usuarios

La tabla muestra todos los usuarios registrados con su nombre, correo, rol y estado (activo/inactivo).

### 13.2 Crear un nuevo usuario

1. Hacer clic en **+ Nuevo Usuario**.
2. Completar: nombre, apellido, cédula, correo, contraseña y rol.
3. Hacer clic en **Guardar**.

### 13.3 Roles disponibles

| Rol | Acceso |
|---|---|
| **Administrador** | Acceso total: puede crear, editar y eliminar todos los registros |
| **Operario** | Solo puede consultar información; no puede crear ni modificar registros |

---

## 14. Reporte PDF

El sistema genera un reporte completo en formato PDF con toda la información operativa y contable de la granja.

### 14.1 Cómo generar el reporte

Desde el **Dashboard**, hacer clic en el botón **Reporte PDF**. El archivo se descarga automáticamente con el nombre `reporte-sayfer-[fecha].pdf`.

### 14.2 Contenido del reporte

El reporte está organizado en 15 secciones:

| # | Sección | Contenido |
|---|---|---|
| 1 | Resumen General | Indicadores globales: ciclos, aves, inversiones, pérdidas |
| 2 | Galpones | Lista de galpones con capacidad y área |
| 3 | Ciclos Activos | Ciclos en curso con cantidad de pollos e inversión |
| 4 | Ciclos Finalizados | Ciclos cerrados con la misma información |
| 5 | Costo Acumulado por Ciclo | Desglose de inversión: pollos + alimento + medicamentos |
| 6 | Alertas de Vencimiento | Productos vencidos o por vencer en los próximos 30 días |
| 7 | Stock de Alimentos | Inventario actual por tipo de alimento |
| 8 | Stock de Medicamentos | Inventario actual por medicamento |
| 9 | Inversión en Alimentos | Total comprado por tipo de alimento con valor |
| 10 | Inversión en Medicamentos | Total comprado por medicamento con valor |
| 11 | Consumo de Alimento por Ciclo | Kilos consumidos por tipo y por ciclo |
| 12 | Consumo de Medicamentos por Ciclo | Unidades aplicadas por tipo y por ciclo |
| 13 | Detalle Adm. de Alimentos | Registro completo de suministros |
| 14 | Detalle Adm. de Medicamentos | Registro completo de aplicaciones |
| 15 | Registro de Mortalidades | Bajas por ciclo con tasa de mortalidad y pérdida económica aproximada |

---

## 15. Configuración

Accesible desde el menú lateral, permite personalizar la experiencia del sistema.

### 15.1 Tema visual

Seleccionar entre tres opciones:
- **Claro**: fondo blanco con texto oscuro.
- **Oscuro**: fondo oscuro con texto claro.
- **Sistema**: sigue la configuración del dispositivo del usuario.

### 15.2 URL de la API

Permite cambiar la dirección del servidor backend en caso de que el sistema se encuentre en una red diferente.

### 15.3 Mi Perfil

Permite al usuario consultar y actualizar sus datos personales y cambiar su contraseña.

---

## 16. Roles y Permisos

| Acción | Administrador | Operario |
|---|---|---|
| Ver dashboard y estadísticas | ✅ | ✅ |
| Ver tablas e historial | ✅ | ✅ |
| Ver gráficas | ✅ | ✅ |
| Generar reporte PDF | ✅ | ✅ |
| Crear / editar galpones | ✅ | ❌ |
| Crear / editar ciclos | ✅ | ❌ |
| Registrar ingresos de alimento | ✅ | ❌ |
| Registrar ingresos de medicamento | ✅ | ❌ |
| Registrar suministro de alimento | ✅ | ❌ |
| Registrar aplicación de medicamento | ✅ | ❌ |
| Registrar bajas de mortalidad | ✅ | ❌ |
| Gestionar usuarios | ✅ | ❌ |
| Eliminar registros | ✅ | ❌ |

---

## 17. Preguntas Frecuentes

**¿Por qué no puedo seleccionar un galpón al crear un ciclo?**
El galpón ya está asignado a otro ciclo activo. Solo quedará disponible cuando ese ciclo sea cerrado (registrando una fecha fin).

**¿Por qué el stock de alimento no cambia después de registrar un suministro?**
El stock se descuenta automáticamente al registrar la administración de alimento. Verificar que el registro se haya guardado correctamente.

**¿Qué significa "—" en la columna de Tasa de mortalidad?**
Significa que el ciclo no tiene registrada la cantidad inicial de pollos. Editar el ciclo e ingresar el valor en el campo "Cantidad de pollos".

**¿El sistema funciona sin conexión a internet?**
No. SAYFER requiere conexión al servidor backend para funcionar. Si el servidor está en red local, se necesita estar conectado a esa red.

**¿Cómo se calcula la pérdida por mortalidad en el reporte?**
Se multiplica el número de bajas del ciclo por el **valor por pollo** registrado al iniciar el ciclo. Es una estimación del costo de las aves perdidas.

**¿Los datos del reporte PDF están actualizados en tiempo real?**
Sí. Cada vez que se genera el reporte, el sistema consulta los datos más recientes del servidor.

---

*SAYFER — Sistema de Gestión Avícola · Versión Beta 0.0.1*
