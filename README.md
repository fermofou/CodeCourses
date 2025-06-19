# Front-End: Code Courses

## Currently not hosted

## Cool short demo:
https://youtu.be/jgEOpzIEV1I


## Full demo:
[![Watch the demo](https://img.youtube.com/vi/v5wk9jZ-Slo/hqdefault.jpg)](https://www.youtube.com/watch?v=v5wk9jZ-Slo)

## 📑 Índice

* [Requerimientos Funcionales](#requerimientos-funcionales)
* [Requerimientos No Funcionales](#requerimientos-no-funcionales)
* [Historias de Usuario](#historias-de-usuario)
  * [HU-001 - Login de Usuario](#hu-001---login-de-usuario)
  * [HU-002 - Resolver Problemas de Programación](#hu-002---resolver-problemas-de-programación)
  * [HU-003 - Filtrar Problemas](#hu-003---filtrar-problemas)
  * [HU-004 - Ver Detalles del Problema](#hu-004---ver-detalles-del-problema)
  * [HU-005 - Escribir y Ejecutar Código](#hu-005---escribir-y-ejecutar-código)
  * [HU-006 - Sistema de Recompensas](#hu-006---sistema-de-recompensas)
  * [HU-007 - Dashboard de Avances](#hu-007---dashboard-de-avances)

---
## Requerimientos Funcionales

### Gestión de Problemas

#### Scrapping y Transformación
- Uso de `CF-Contest-Problem-Scrapper` para extraer problemas de CodeForces.
- Aplicar un script (basado en un LLM) que modifique el nombre y la descripción para adaptarlo a la temática de Tech Mahindra.
- Guardar el problema transformado en la base de datos.

#### Tabla de Problemas
- Campos obligatorios: `id`, `nombre`, `descripción`, `dificultad (rating)`, `link al problema original`.
- Campos adicionales: `tags`, `fecha de creación`, `fecha de actualización`.

### Interfaz de Usuario – Sección Code Challenges

#### Listado de Problemas
- Mostrar los problemas filtrados por dificultad y etiquetas.

#### Detalle de Problema
- Página con:
  - Panel izquierdo: descripción del problema.
  - Panel derecho: editor de código integrado.
  - Botón de **Enviar** para realizar la entrega.

### Validación y Evaluación de Envíos

#### Editor de Código
- Integración con imagenes de Docker que puedan ejecutar el código en los lenguajes disponibles.
- Permite escribir, editar y enviar código.

#### Integración con Judge0
- Al enviar código:
  - Invocar API de Judge0 para compilar, ejecutar y comparar con output esperado.
  - Mostrar errores o mensajes de validación en tiempo real.

#### Validación Adicional con SonarQube
- Evaluar calidad del código (estilo, sintaxis, seguridad, etc.).
- Si cumple con estándares, mostrar mensaje de **Completado** y marcar problema como resuelto.

#### Actualización de XP y Currency
- Si la entrega es correcta:
  - Actualizar estadísticas del usuario (XP y currency).

### Gestión de Usuarios (Futuro/Base)
- Registro, login y gestión de perfiles.
- Registro de progreso y problemas completados.

---

## Requerimientos No Funcionales

### Usabilidad
- Interfaz intuitiva y responsiva.
- Especial atención al editor y estadísticas.

### Performance
- Respuesta rápida al cargar listados de problemas y validar envíos.

### Seguridad
- Autenticación robusta.
- Validación/sanitización de entradas en el editor.

### Escalabilidad
- Arquitectura modular para futuras funcionalidades (Tech Trivia, recompensas, etc.).

### Mantenibilidad
- Código y documentación clara y estructurada.

---

## Historias de Usuario con Caso de uso

### HU-001 - Login de Usuario
**Descripción:** Como usuario y trabajador de la empresa, quiero poder ingresar a la plataforma.  
**Criterios de Aceptación:**
- Ingreso con correo y contraseña.
- Permitir uso de cuenta Google para mayor velocidad.
- Mensaje de error si son incorrectos o inválidos.

---

### HU-002 - Resolver Problemas de Programación
**Descripción:** Como usuario, quiero poder acceder a los problemas de programación para resolverlos.  
**Criterios de Aceptación:**
- Ingresar correctamente.
- Acceder a sección “Problemas de programación”.
- Seleccionar problema a resolver.
- Obtener XP y puntos en caso de responder correctamente.

---

### HU-003 - Filtrar Problemas
**Descripción:** Como usuario, quiero filtrar problemas por dificultad y etiquetas.  
**Criterios de Aceptación:**
- Opciones de filtro visibles.
- Lista actualizada automáticamente.
- Posibilidad de quitar filtros.
---

### HU-004 - Ver Detalles del Problema
**Descripción:** Como usuario, quiero ver la descripción completa del problema.  
**Criterios de Aceptación:**
- Página con descripción al hacer clic.
- Mostrar dificultad, etiquetas y link original.
- Botón para regresar.

---

### HU-005 - Escribir y Ejecutar Código
**Descripción:** Como usuario, quiero escribir y ejecutar mi código para comprobar si funciona.  
**Criterios de Aceptación:**
- Editor integrado.
- Botón “Ejecutar” que envía a contenedor en VM.
- Resultados mostrados en la interfaz.


---

### HU-006 - Sistema de Recompensas
**Descripción:** Como usuario, quiero recibir XP y puntos  al resolver problemas.  
**Criterios de Aceptación:**
- Código válido actualiza puntos para tienda.
- Notificación de éxito.
- Actualización en perfil.
- Solo puede comprar usuario si alcanza por puntos y quedan productos disponibles.

---

### HU-007 - Dashboard de Avances
**Descripción:** Como usuario, quiero ver mi avance y el de mis compañeros.  
**Criterios de Aceptación:**
- Ver porcentaje de aceptación, problemas resueltos y promedio de equipo.
- Acceder a información de otros usuarios.


