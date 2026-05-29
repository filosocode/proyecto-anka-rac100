# ANKA RAC 100 — App Móvil Ionic/Angular

Aplicación móvil híbrida para gestión de formularios de inspección de drones.
Stack: **Ionic 8 + Angular 20 + TypeScript 5.9 — Standalone Components**

---

## INSTRUCCIONES PARA CLAUDE

Este proyecto está en `C:\anka-rac100`. El proyecto Ionic vive dentro de `app/`.

**Estado actual del repo:**
- La base del proyecto está en la rama `develop` (commit `baf436a`)
- Cada integrante trabaja en su rama feature y mergea a `develop`
- `main` solo recibe merges de `develop` en entregas

**Nunca toques directamente `main`. Nunca hagas `npm install` en D:.**

**Rutas importantes:**
- Proyecto Ionic: `C:\anka-rac100\app\`
- Rutas: `app/src/app/app.routes.ts`
- Servicios compartidos: `app/src/app/shared/services/`
- Modelos: `app/src/app/shared/models/`

**Para correr la app:**
```bash
cd C:\anka-rac100\app
npm install      # solo la primera vez, requiere Node 22
ionic serve
```

**Usuarios de prueba (mock, sin backend):**
- Admin: `admin@anka.com` / `123456`
- Piloto: `piloto@anka.com` / `123456`

---

## Equipo y ramas

| Integrante | Rama | Módulos asignados |
|---|---|---|
| **Andrés Muñoz** (líder) | `feature/auth-andres` | auth/login, guards, admin/user-management |
| **Rubén** | `feature/forms-ruben` | forms/form-list, form-fill, form-draft |
| **Camilo** | `feature/history-admin-camilo` | history, admin/drone-management, profile |

---

## Setup inicial (hacer una sola vez por máquina)

### 1. Instalar Node 22 LTS

Descargar nvm-windows: https://github.com/coreybutler/nvm-windows/releases

```bash
nvm install 22.16.0
nvm use 22.16.0
node --version   # debe mostrar v22.x
```

### 2. Clonar el repo EN C: (no en OneDrive, no en D: si es nube)

```bash
git clone https://github.com/filosocode/proyecto-anka-rac100.git C:\anka-rac100
cd C:\anka-rac100\app
npm install
ionic serve      # debe abrir en http://localhost:8100
```

### 3. Cambiar a tu rama de trabajo

```bash
# Rubén
git checkout feature/forms-ruben
git merge origin/develop

# Camilo
git checkout feature/history-admin-camilo
git merge origin/develop

# Andrés
git checkout feature/auth-andres
git merge origin/develop
```

---

## Estructura del proyecto

```
C:\anka-rac100\
├── app/                        ← proyecto Ionic (trabajar siempre aquí)
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.routes.ts   ← rutas centrales con lazy loading y guards
│   │   │   ├── app.component.ts
│   │   │   │
│   │   │   ├── auth/           ← ANDRÉS
│   │   │   │   ├── login/      ← pantalla de login (RF1)
│   │   │   │   └── guards/     ← authGuard + roleGuard (RF12)
│   │   │   │
│   │   │   ├── forms/          ← RUBÉN
│   │   │   │   ├── form-list/  ← RF2: consulta de formularios
│   │   │   │   ├── form-fill/  ← RF3: diligenciamiento + RF7: validación
│   │   │   │   └── form-draft/ ← RF4: borradores offline
│   │   │   │
│   │   │   ├── history/        ← CAMILO
│   │   │   │   └── history-list/ ← RF8: consulta de historial
│   │   │   │
│   │   │   ├── admin/          ← ANDRÉS + CAMILO
│   │   │   │   ├── user-management/  ← RF11: gestión usuarios (Andrés)
│   │   │   │   └── drone-management/ ← RF13: gestión drones (Camilo)
│   │   │   │
│   │   │   ├── profile/        ← CAMILO
│   │   │   │   └── profile-page/
│   │   │   │
│   │   │   └── shared/         ← TODOS (no modificar sin avisar)
│   │   │       ├── models/
│   │   │       │   ├── user.model.ts
│   │   │       │   ├── form.model.ts
│   │   │       │   └── drone.model.ts
│   │   │       └── services/
│   │   │           ├── auth.service.ts    ← RF1, RF12
│   │   │           ├── storage.service.ts ← RF5 (offline)
│   │   │           └── sync.service.ts    ← RF10 (pendiente backend)
│   │   │
│   │   ├── main.ts
│   │   ├── index.html
│   │   ├── global.scss
│   │   └── theme/variables.scss
│   │
│   ├── package.json
│   ├── angular.json
│   └── ionic.config.json
│
├── docs/
├── recursos/
├── .nvmrc                      ← Node 22.16.0
└── README.md
```

---

## Requerimientos funcionales y estado

| RF | Descripción | Responsable | Estado |
|---|---|---|---|
| RF1 | Autenticación de usuario | Andrés | Base lista (mock) |
| RF2 | Consulta de formularios | Rubén | Base lista |
| RF3 | Diligenciamiento de formularios | Rubén | Base lista |
| RF4 | Guardado de borradores | Rubén | Base lista |
| RF5 | Funcionamiento sin conexión | Rubén | StorageService listo |
| RF7 | Validación de campos obligatorios | Rubén | Base lista |
| RF8 | Consulta de historial | Camilo | Base lista |
| RF9 | Adjuntar evidencia | Camilo | Pendiente |
| RF10 | Sincronización de información | Camilo | SyncService base |
| RF11 | Gestión de usuarios | Andrés | Base lista |
| RF12 | Control de acceso por roles | Andrés | Guards listos |
| RF13 | Gestión de drones y formularios | Camilo | Base lista |

---

## Flujo de trabajo Git

```
feature/auth-andres       ──┐
feature/forms-ruben       ──┼──► develop ──► main (entregas)
feature/history-admin-camilo ──┘
```

**Reglas:**
1. Trabajar siempre en tu rama feature
2. Antes de mergear a `develop`, hacer `git merge origin/develop` en tu rama
3. Nunca pushear directo a `main` ni a `develop`
4. Commit frecuente con mensajes descriptivos

**Flujo de merge a develop:**
```bash
# En tu rama feature
git add .
git commit -m "feat: descripción de lo que hiciste"
git push origin feature/tu-rama

# Luego crear Pull Request en GitHub hacia develop
```

---

## Comandos útiles

```bash
# Correr la app
cd C:\anka-rac100\app
ionic serve

# Generar una nueva página
ionic generate page nombre-pagina

# Ver ramas
git branch -a

# Sincronizar tu rama con develop
git fetch origin
git merge origin/develop

# Ver estado
git status
git log --oneline -5
```

---

## Notas técnicas importantes

- **Standalone components**: NO usar NgModule. Cada componente declara sus propios `imports: []`
- **Offline**: usar `StorageService` (localStorage) para persistir datos, no variables en memoria
- **Routing**: todas las rutas están en `app.routes.ts` con lazy loading — agregar nuevas rutas ahí
- **Guards**: `authGuard` protege rutas de usuarios no autenticados; `roleGuard` restringe a admins
- **Node 22 obligatorio**: Node 24 tiene un bug en Windows que rompe `npm install`
- **NO desarrollar en OneDrive/Google Drive**: los archivos se corrompen al escribir
