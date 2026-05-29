# ANKA RAC 100 — App Móvil Multiplataforma

Aplicación Ionic/Angular para el diligenciamiento offline de formularios operativos bajo la normativa RAC 100 de drones en Colombia.

## Requisitos

- Node.js 18+
- Ionic CLI: `npm install -g @ionic/cli`

## Cómo correr el proyecto

```bash
cd app
npm install
npm start        # abre en http://localhost:8100
```

**Credenciales de prueba:**

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@anka.co | 1234 |
| Piloto | piloto@anka.co | 1234 |

## Estructura de ramas

| Rama | Responsable | Páginas asignadas |
|------|-------------|-------------------|
| `feature/auth-andres` | Andrés | Login, Guards de autenticación |
| `feature/forms-ruben` | Rubén | Formularios disponibles, Llenar formulario, Borradores |
| `feature/history-admin-camilo` | Camilo | Historial, Perfil, Gestión drones, Gestión usuarios |

## Flujo de trabajo Git

```bash
# 1. Siempre parte de develop actualizado
git checkout develop
git pull origin develop

# 2. Cambia a tu rama
git checkout feature/tu-rama

# 3. Trae los últimos cambios de develop
git merge develop

# 4. Trabaja en tus archivos asignados

# 5. Sube tu trabajo
git add .
git commit -m "feat: descripción de lo que hiciste"
git push origin feature/tu-rama
```

## Servicios disponibles (ya implementados en `develop`)

- **AuthService** — `shared/services/auth.service.ts`
  - `login(email, password)` → `boolean`
  - `logout()` → redirige al login
  - `currentUser` → `signal<User | null>`
  - `isAdmin()` → `boolean`

- **FormService** — `shared/services/form.service.ts`
  - `getTemplates()` → lista de plantillas RAC 100
  - `getTemplate(id)` → plantilla específica
  - `getDrafts()` → borradores guardados
  - `getSubmitted()` → formularios enviados
  - `saveEntry(entry)` → guarda borrador o envío
  - `deleteEntry(id)` → elimina entrada

- **DroneService** — `shared/services/drone.service.ts`
  - `getAll()` → lista de drones
  - `save(drone)` → crea o actualiza drone
  - `delete(id)` → elimina drone

- **StorageService** — `shared/services/storage.service.ts`
  - `set(key, value)`, `get<T>(key)`, `remove(key)`

## Modelos

```typescript
User { id, email, name, role: 'admin' | 'pilot' }
FormTemplate { id, title, fields: FormField[] }
FormField { name, label, type, required, options? }
FormEntry { id, templateId, pilotId, data, status, createdAt, updatedAt }
Drone { id, serial, model, status }
```
