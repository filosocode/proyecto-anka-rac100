# ANKA RAC100 — Estado real de entrega final
**Grupo:** SRM-EPM-G4 · Andrés Muñoz · Rubén Santos · Camilo Basante  
**Politécnico Grancolombiano · Énfasis en Programación Móvil · Grupo B04**  
**Repositorio:** https://github.com/filosocode/proyecto-anka-rac100  
**APK en repo:** `ANKA-RAC100.apk` (raíz del repositorio)

---

## Tabla de auditoría — qué está hecho vs. qué falta

| Artefacto exigido | Responsable | Estado | Observación |
|---|---|---|---|
| Tabla control de cambios RF (RF-SYNC, RF-FOTO, RF-RECOVER) | Camilo | ✅ Completo | Tabla con 3 RF + justificación técnica detallada |
| Conclusiones del proceso (aprendizajes / dificultades / recomendaciones) | Camilo | ✅ Completo | 3 párrafos, responde las 3 preguntas pedidas |
| Documento de monetización (Play Store + 3 modelos) | Camilo | ✅ Completo | Incluye matriz de modelos y recomendación |
| **Portada institucional** | — | ❌ Ausente | El documento arranca directo en la tabla, sin nombres / tutor / facultad |
| **Tabla de contenido** | — | ❌ Ausente | No hay TOC ni numeración de secciones |
| **Diagrama de flujo actualizado** ("Recuperar contraseña") | Rubén | ❌ Ausente | 0 imágenes en el .docx |
| **Diagrama UML de clases v3** (SyncService, FormEntry.data) | Rubén | ❌ Ausente | 0 imágenes en el .docx |
| **Mockups / capturas de las 11 pantallas rediseñadas** | Andrés | ❌ Ausente | 0 imágenes en el .docx — capturas pendientes de tomar |
| **Enlace APK funcional** | Rubén | ❌ Ausente | Sin hipervínculos a Drive/repo en el documento |
| **Enlace video demo** (≤5 min) | Rubén | ❌ Ausente | Video no grabado todavía |
| **Enlace repositorio** | — | ❌ Ausente | Sin hipervínculos de ningún tipo en el .docx |

---

## Lo que Andrés YA TIENE listo (código + APK)

Andrés completó **toda la parte de código y diseño visual** de la app. Aquí está el detalle para que quede en el documento:

### App 100% funcional — pantallas implementadas

#### Pantallas del piloto (5)
| Pantalla | Qué hace |
|---|---|
| **Login** | Autenticación email/contraseña. Hero con drone animado SVG, card con gradiente naranja, soporte dark mode completo |
| **Lista de formularios** | Muestra los formularios activos creados por el admin |
| **Llenar formulario** | Diligencia campos (texto, número, fecha, selección, GPS, foto/archivo). Asocia un drone. Guarda borrador o envía |
| **Borradores** | Lista de formularios guardados sin enviar. Permite retomarlos y continuar |
| **Historial** | Registro de formularios enviados con estado: `draft` / `submitted` / `synced` |
| **Perfil** | Datos del usuario, toggle de tema claro/oscuro, cerrar sesión |
| **Recuperar contraseña** | Página informativa (sin backend): indica al piloto que contacte a `admin@anka.co` |

#### Panel administrador (5 secciones)
| Sección | Qué hace |
|---|---|
| **Gestión de drones** | CRUD completo: serial, modelo, tipo, estado (activo / mantenimiento / inactivo) |
| **Gestión de usuarios** | CRUD de pilotos y admins con roles |
| **Gestión de formularios** | CRUD de plantillas. Activa/desactiva. Edición **inline** del nombre directamente en la card |
| **Campos del formulario** | Agrega, edita y elimina campos. Edición **inline** con cambio de tipo (texto, número, fecha, selección, GPS, foto) |
| **Perfil admin** | Toggle dark/light mode, cerrar sesión |

### Diseño visual (trabajo de Andrés)
- Paleta ANKA: azul primario `#364A73`, naranja secundario `#F25D27`
- **Dark mode completo** — toggle en Perfil, aplica a toda la app (`body[data-theme="dark"]`)
- Login: fondo con radial gradient azul marino, drone animado con hélices giratorias, card flotante con handle naranja
- Animaciones de entrada: `fadeInUp`, `scaleIn`, delays escalonados
- Drone animado: componente SVG propio con hélices, anillos de radar y LED parpadeante

### APK generado ✅
- Build de producción: `ng build --configuration production`
- Empaquetado con Capacitor: `npx cap copy android` + `gradlew assembleDebug`
- **Tamaño:** 4.17 MB
- **Ubicación en el repo:** `ANKA-RAC100.apk` en la raíz
- **Credenciales demo precargadas:**
  - Admin: `admin@anka.co` / `1234`
  - Piloto: `piloto@anka.co` / `1234`

---

## Lo que falta — acciones concretas por persona

### Andrés — Capturas de pantalla para el documento
Tomar screenshots de estas 11 pantallas y enviárselas a Camilo para que las pegue en el .docx:

1. Login — modo claro
2. Login — modo oscuro
3. Lista de formularios (piloto)
4. Llenar formulario (con campos GPS y foto visibles)
5. Borradores
6. Historial (con estados de color)
7. Perfil — con toggle visible
8. Panel admin: Drones
9. Panel admin: Usuarios
10. Panel admin: Formularios (con botón editar inline visible)
11. Panel admin: Campos de formulario

> **Cómo tomar las capturas:** conectar el celular con el APK instalado y hacer screenshot, o abrir `http://192.168.1.9:8100` desde el navegador del computador y usar la herramienta de captura de pantalla.

---

### Rubén — Diagramas + APK link + Video

#### Diagrama de flujo: "Recuperar contraseña"
Flujo a diagramar:
```
Login → [¿Olvidaste tu contraseña?] → Página Recuperar Contraseña
→ Mensaje: "Contacta al admin en admin@anka.co"
→ [Botón volver] → Login
```

#### Diagrama UML de clases v3 — actualizar con:
```
SyncService
  + isOnline(): boolean
  + getPendingCount(): number
  + syncPending(): Promise<void>

FormEntry
  - id: string
  - templateId: string
  - pilotId: string
  - droneId: string
  - data: Record<string, any>   ← campo tipo 'file' almacena base64
  - status: 'draft' | 'submitted' | 'synced'
  - createdAt: string
  - updatedAt: string
```

#### Enlace APK — pegar en el documento
El APK ya está en el repositorio. En el .docx agregar:

> **APK:** https://github.com/filosocode/proyecto-anka-rac100/raw/main/ANKA-RAC100.apk  
> **Repositorio:** https://github.com/filosocode/proyecto-anka-rac100

#### Video demo — qué mostrar (máx. 5 min)
El profe lo describió como una **vista previa estilo Play Store**:

**Flujo piloto:**
1. Login con `piloto@anka.co / 1234`
2. Ver lista de formularios disponibles
3. Seleccionar formulario → elegir drone → llenar campos
4. Usar GPS (mostrar que captura coordenadas)
5. Guardar borrador → ir a Borradores → reanudar → Enviar
6. Ver en Historial con estado "enviado"

**Flujo admin:**
1. Login con `admin@anka.co / 1234`
2. Crear drone nuevo
3. Crear formulario con campos (texto, GPS, foto)
4. Activar formulario → probar edición inline del nombre
5. Gestión de usuarios: crear piloto nuevo

**Demostración de tema:**
- Perfil → activar modo oscuro → mostrar cambio en toda la app

---

### Camilo — Completar el .docx con lo que falta

#### 1. Portada institucional — agregar al inicio del documento:
```
Politécnico Grancolombiano
Facultad de Ingeniería y Ciencias Básicas
Énfasis en Programación Móvil — Grupo B04

ANKA RAC100
Aplicación móvil para gestión de formularios de campo
conforme al Reglamento Aeronáutico de Colombia RAC 100

Integrantes:
- Andrés Eduardo Muñoz Roa
- Rubén Darío Santos Mejía
- Camilo Basante Torres

Tutor: Victor Fabian Castro Perez
Junio 2026
```

#### 2. Tabla de contenido — agregar después de la portada:
Numeración sugerida:
```
1. Control de cambios en requerimientos
2. Conclusiones del proceso
3. Diagramas actualizados (Rubén)
   3.1 Diagrama de flujo — Recuperar contraseña
   3.2 Diagrama UML de clases v3
4. Mockups y capturas de pantalla (Andrés)
5. Monetización y publicación
6. Enlace APK y repositorio
```

#### 3. Pegar las capturas que envíe Andrés en la sección 4

#### 4. Pegar los diagramas que envíe Rubén en la sección 3

#### 5. Agregar sección de enlaces al final:
```
APK: https://github.com/filosocode/proyecto-anka-rac100/raw/main/ANKA-RAC100.apk
Repositorio: https://github.com/filosocode/proyecto-anka-rac100
Video demo: [enlace que suba Rubén]
```

---

## Checklist final

### Andrés
- [x] Diseño visual completo (login, tema oscuro/claro, panel admin, drone animado)
- [x] APK generado y en el repositorio (`ANKA-RAC100.apk`)
- [x] Código pusheado a `main`
- [ ] **Tomar capturas de las 11 pantallas** y enviárselas a Camilo

### Rubén
- [ ] Diagrama de flujo "Recuperar contraseña"
- [ ] Diagrama UML clases v3 (SyncService + FormEntry.data)
- [ ] Grabar video demo (máx. 5 min) y subir a YouTube o Drive
- [ ] Pasar diagramas y enlace de video a Camilo

### Camilo
- [x] Tabla de cambios RF (RF-SYNC, RF-FOTO, RF-RECOVER)
- [x] Conclusiones del proceso
- [x] Documento de monetización
- [ ] **Agregar portada institucional** al documento
- [ ] **Agregar tabla de contenido**
- [ ] **Pegar capturas de pantalla** que envíe Andrés
- [ ] **Pegar diagramas** que envíe Rubén
- [ ] **Agregar enlace APK, repositorio y video** en el documento

---

*Última actualización: 23 de junio de 2026 · SRM-EPM-G4*
