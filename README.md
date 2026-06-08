# ANKA RAC 100 — App Móvil de Formularios Operativos para Drones

Aplicación móvil híbrida desarrollada con **Ionic 7 + Angular 17 + Capacitor 6** para el diligenciamiento offline de formularios operativos bajo la normativa **RAC 100** de operación de drones en Colombia.

---

## Tabla de contenidos

1. [Descripción del proyecto](#descripción-del-proyecto)
2. [Stack tecnológico](#stack-tecnológico)
3. [Credenciales de prueba](#credenciales-de-prueba)
4. [Funcionalidades implementadas](#funcionalidades-implementadas)
5. [Arquitectura y estructura del proyecto](#arquitectura-y-estructura-del-proyecto)
6. [Modelos de datos](#modelos-de-datos)
7. [Servicios](#servicios)
8. [Rutas y navegación](#rutas-y-navegación)
9. [Cómo ejecutar en web](#cómo-ejecutar-en-web)
10. [Cómo generar el APK Android](#cómo-generar-el-apk-android)
11. [Flujo de trabajo Git](#flujo-de-trabajo-git)
12. [Equipo](#equipo)

---

## Descripción del proyecto

ANKA RAC 100 permite a pilotos de drones diligenciar, guardar y enviar formularios operativos (pre-vuelo, post-vuelo, autorización) directamente desde su dispositivo móvil. Los administradores pueden gestionar usuarios, drones y plantillas de formularios desde un panel dedicado.

El almacenamiento es **offline-first**: toda la información se guarda en `localStorage` del dispositivo, sin depender de conexión a internet para el flujo principal.

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Ionic | 7.x | Componentes UI móviles |
| Angular | 17.x | Framework frontend (standalone components) |
| Capacitor | 6.x | Puente nativo Android/iOS |
| TypeScript | 5.x | Lenguaje base |
| localStorage | nativo | Persistencia offline |
| Android SDK | API 33+ | Build APK |
| Java JDK | 17 | Compilación Android |

---

## Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@anka.co` | `1234` |
| Piloto | `piloto@anka.co` | `1234` |

---

## Funcionalidades implementadas

### Módulo Autenticación
- Login con validación de credenciales
- Redirección automática según rol (`admin` → panel admin, `pilot` → home piloto)
- Guards de ruta: `authGuard` (sesión activa) y `adminGuard` (rol admin)
- Persistencia de sesión en localStorage
- Logout con confirmación

### Panel Piloto
- **Formularios disponibles**: lista solo los formularios activos
- **Diligenciar formulario**:
  - Selector de drone obligatorio (asociación tipada con `droneId`)
  - 6 tipos de campo: `texto`, `número`, `fecha`, `selección`, `foto/archivo`, `ubicación GPS`
  - Validación de campos obligatorios antes de enviar
  - Mensaje de error en pantalla si faltan campos
- **Guardar borrador**: guarda el progreso sin enviar
- **Editar borrador**: retoma un borrador desde la lista de borradores
- **Historial**: lista de formularios enviados con estado y fecha
- **Perfil**: visualización y edición de datos del usuario
- **Cerrar sesión**: con diálogo de confirmación

### Panel Administrador
- Navegación por tabs: **Drones · Usuarios · Formularios**
- **Gestión de Drones**: crear, editar, eliminar drones (serial, modelo, tipo, estado)
- **Gestión de Usuarios**: crear, editar, eliminar usuarios con asignación de rol
- **Gestión de Formularios**:
  - Crear, editar y eliminar plantillas de formulario
  - Activar / desactivar formularios (solo los activos son visibles para pilotos)
  - Navegar a gestión de campos de cada formulario
- **Gestión de Campos** (pantalla separada por formulario):
  - Flujo guiado de 4 pasos: etiqueta → tipo → obligatorio → opciones (si aplica)
  - Tipos disponibles: texto, número, fecha, selección, foto/archivo, ubicación GPS
  - Eliminar campos con confirmación
  - Botón de regreso siempre visible hacia la lista de formularios

---

## Arquitectura y estructura del proyecto

```
proyecto-anka-rac100/
├── app/                          # Proyecto Ionic/Angular
│   ├── src/
│   │   └── app/
│   │       ├── auth/
│   │       │   ├── login/        # Página de inicio de sesión
│   │       │   └── guards/       # authGuard, adminGuard
│   │       │
│   │       ├── home/             # Shell de tabs del piloto
│   │       │   └── home-tabs.page
│   │       │
│   │       ├── forms/
│   │       │   ├── form-list/    # Formularios disponibles (filtra activos)
│   │       │   ├── form-fill/    # Diligenciar formulario (+ selector drone)
│   │       │   └── form-draft/   # Borradores guardados
│   │       │
│   │       ├── history/
│   │       │   └── history-list/ # Historial de formularios enviados
│   │       │
│   │       ├── profile/
│   │       │   └── profile-page/ # Perfil del usuario
│   │       │
│   │       ├── admin/
│   │       │   ├── admin-tabs/         # Shell de tabs del administrador
│   │       │   ├── drone-management/   # CRUD drones
│   │       │   ├── user-management/    # CRUD usuarios
│   │       │   ├── form-management/    # CRUD plantillas de formulario
│   │       │   └── form-fields/        # Gestión de campos por plantilla
│   │       │
│   │       └── shared/
│   │           ├── models/       # Interfaces TypeScript
│   │           └── services/     # Lógica de negocio y persistencia
│   │
│   └── android/                  # Proyecto nativo Android (Capacitor)
```

### Patrón de arquitectura

- **Standalone Components**: cada página es un componente independiente sin NgModules
- **Lazy loading**: todas las rutas cargan su componente de forma diferida
- **Signal-based state**: `AuthService.currentUser` usa `signal<User | null>` de Angular
- **Service layer**: toda la lógica de datos vive en servicios inyectables, las páginas solo llaman métodos
- **Offline-first**: `StorageService` encapsula `localStorage`; no hay llamadas HTTP

---

## Modelos de datos

```typescript
// Usuario autenticado
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'pilot';
}

// Drone registrado
interface Drone {
  id: string;
  serial: string;
  model: string;
  tipo: string;
  status: 'active' | 'maintenance' | 'inactive';
}

// Plantilla de formulario (configurable por admin)
interface FormTemplate {
  id: string;
  title: string;
  fields: FormField[];
  active: boolean;          // solo los activos son visibles para pilotos
}

// Campo individual de una plantilla
interface FormField {
  name: string;             // clave interna (ej: "zona_operacion")
  label: string;            // etiqueta visible (ej: "Zona de Operación")
  type: 'text' | 'number' | 'date' | 'select' | 'file' | 'location';
  required: boolean;
  options?: string[];       // solo para type: 'select'
}

// Registro diligenciado por un piloto
interface FormEntry {
  id: string;
  templateId: string;       // referencia a la plantilla usada
  pilotId: string;          // referencia al piloto
  droneId: string;          // asociación tipada con el drone usado
  data: Record<string, any>;// valores de cada campo
  status: 'draft' | 'submitted' | 'synced';
  createdAt: string;
  updatedAt: string;
}
```

---

## Servicios

### `AuthService`
| Método | Descripción |
|---|---|
| `login(email, password)` | Valida credenciales, persiste sesión |
| `logout()` | Limpia sesión y redirige a login |
| `currentUser` | Signal reactivo con el usuario actual |
| `isAdmin()` | `true` si el rol es `'admin'` |
| `addUser(user)` | Crea nuevo usuario (admin) |
| `updateUser(id, changes)` | Actualiza datos de usuario |
| `deleteUser(id)` | Elimina usuario |
| `getUsers()` | Lista todos los usuarios |

### `FormService`
| Método | Descripción |
|---|---|
| `getTemplates()` | Lista todas las plantillas |
| `getTemplate(id)` | Obtiene una plantilla por ID |
| `saveTemplate(template)` | Crea o actualiza plantilla |
| `deleteTemplate(id)` | Elimina plantilla |
| `toggleActive(id)` | Activa o desactiva una plantilla |
| `generateTemplateId()` | Genera ID único para plantilla |
| `getEntries()` | Lista todos los registros |
| `getDrafts()` | Lista solo los borradores |
| `getSubmitted()` | Lista enviados y sincronizados |
| `getEntry(id)` | Obtiene un registro por ID |
| `saveEntry(entry)` | Guarda borrador o envío |
| `deleteEntry(id)` | Elimina un registro |
| `generateId()` | Genera ID único para registro |

### `DroneService`
| Método | Descripción |
|---|---|
| `getAll()` | Lista todos los drones |
| `getById(id)` | Obtiene un drone por ID |
| `save(drone)` | Crea o actualiza drone |
| `delete(id)` | Elimina drone |
| `generateId()` | Genera ID único para drone |

### `StorageService`
Capa de abstracción sobre `localStorage`.

| Método | Descripción |
|---|---|
| `set(key, value)` | Guarda objeto serializado |
| `get<T>(key)` | Recupera y deserializa |
| `remove(key)` | Elimina una clave |

---

## Rutas y navegación

```
/login                          → LoginPage
/home                           → HomeTabsPage (piloto)
  /home/forms                   → FormListPage
  /home/forms/fill/:id          → FormFillPage
  /home/forms/draft             → FormDraftPage
  /home/history                 → HistoryListPage
  /home/profile                 → ProfilePage

/admin                          → AdminTabsPage (admin)
  /admin/drones                 → DroneManagementPage
  /admin/users                  → UserManagementPage
  /admin/forms                  → FormManagementPage

/admin/forms/:id/fields         → FormFieldsPage  ← fuera del tabs para header propio
```

Todas las rutas bajo `/home` requieren `authGuard`.
Todas las rutas bajo `/admin` y `/admin/forms/:id/fields` requieren `authGuard` + `adminGuard`.

---

## Cómo ejecutar en web

```bash
cd app
npm install
npm start
# Abre automáticamente en http://localhost:8100
```

---

## Cómo generar el APK Android

### Requisitos previos
- **Java JDK 17** instalado
- **Android SDK** con API 33+ (Android Studio o SDK Manager)

### Variables de entorno necesarias
```bash
JAVA_HOME=<ruta a JDK 17>
ANDROID_HOME=<ruta a Android SDK>
```

### Pasos

```bash
# 1. Construir la app web
cd app
npx ng build --configuration development

# 2. Sincronizar con el proyecto Android
npx cap copy android

# 3. Compilar el APK
cd android
./gradlew assembleDebug          # Mac/Linux
.\gradlew.bat assembleDebug      # Windows
```

El APK generado queda en:
```
app/android/app/build/outputs/apk/debug/app-debug.apk
```

### Instalar en emulador/dispositivo
```bash
adb install -r app/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Flujo de trabajo Git

```
main          ← rama estable, recibe merges desde develop
  └── develop ← integración continua del equipo
        ├── feature/auth-andres
        ├── feature/forms-ruben
        └── feature/history-admin-camilo
```

### Proceso de trabajo
```bash
# 1. Partir de develop actualizado
git checkout develop
git pull origin develop

# 2. Trabajar en tu rama
git checkout feature/tu-rama
git merge develop

# 3. Subir cambios
git add <archivos específicos>
git commit -m "feat: descripción clara del cambio"
git push origin feature/tu-rama

# 4. Para integrar a main (después de revisión)
git checkout main
git merge develop --no-ff
git push origin main
```

### Convención de commits
| Prefijo | Uso |
|---|---|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `refactor:` | Cambio de estructura sin nueva funcionalidad |
| `docs:` | Cambios en documentación |
| `merge:` | Integración de ramas |

---

## Equipo

| Integrante | Rama | Responsabilidad principal |
|---|---|---|
| Andrés | `feature/auth-andres` | Login, Guards, Perfil, Panel Admin |
| Rubén | `feature/forms-ruben` | Formularios, Borradores, Diligenciamiento |
| Camilo | `feature/history-admin-camilo` | Historial, Gestión Drones, Gestión Usuarios |

---

## Estado del proyecto

| Módulo | Estado |
|---|---|
| Autenticación y guards | ✅ Completo |
| Formularios disponibles (piloto) | ✅ Completo |
| Diligenciar formulario (6 tipos de campo) | ✅ Completo |
| Selector de drone en formulario | ✅ Completo |
| Guardar y editar borradores | ✅ Completo |
| Historial de formularios enviados | ✅ Completo |
| Perfil de usuario | ✅ Completo |
| Panel admin — Gestión de drones | ✅ Completo |
| Panel admin — Gestión de usuarios | ✅ Completo |
| Panel admin — CRUD formularios | ✅ Completo |
| Panel admin — Gestión de campos por formulario | ✅ Completo |
| Recuperar contraseña | ⏳ Pendiente |
| Adjuntar evidencia (página dedicada) | ⏳ Pendiente |
| Sincronización con servidor | ⏳ Pendiente |
