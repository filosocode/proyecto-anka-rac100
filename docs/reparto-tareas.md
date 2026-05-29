# Reparto de Tareas — ANKA RAC 100

## Andrés — `feature/auth-andres`

**Archivos a implementar:**
- `app/src/app/auth/login/login.page.ts`
- `app/src/app/auth/login/login.page.html`

**Qué debe hacer la pantalla de login:**
1. Formulario con campo email y campo contraseña
2. Botón "Ingresar"
3. Si el login falla: mostrar mensaje de error en rojo
4. Si el login es exitoso:
   - Si el usuario es `admin` → navegar a `/admin/drones`
   - Si el usuario es `pilot` → navegar a `/home/forms`
5. (Opcional avanzado) Botón "¿Olvidé mi contraseña?" — puede mostrar un alert

**Servicio a usar:** `AuthService` (ya implementado)
```typescript
// Ejemplo de uso
const ok = this.auth.login(email, password);
if (ok) {
  this.router.navigate(this.auth.isAdmin() ? ['/admin/drones'] : ['/home/forms']);
}
```

---

## Rubén — `feature/forms-ruben`

**Archivos a implementar:**
- `app/src/app/forms/form-list/form-list.page.ts` + `.html`
- `app/src/app/forms/form-fill/form-fill.page.ts` + `.html`
- `app/src/app/forms/form-draft/form-draft.page.ts` + `.html`

**Página 1 — Lista de formularios (`/home/forms`):**
- Mostrar las plantillas disponibles (Pre-vuelo, Post-vuelo, Autorización)
- Al tocar una → navegar a `/home/forms/fill/:id`
- Botón para ver borradores → navegar a `/home/forms/draft`

**Página 2 — Llenar formulario (`/home/forms/fill/:id`):**
- Leer el `id` de la URL con `ActivatedRoute`
- Cargar la plantilla con `FormService.getTemplate(id)`
- Renderizar cada campo dinámicamente según su `type` (text, number, select)
- Botón "Guardar borrador" → `saveEntry({ status: 'draft' })`
- Botón "Enviar" → `saveEntry({ status: 'submitted' })` → navegar a `/home/history`

**Página 3 — Borradores (`/home/forms/draft`):**
- Listar los borradores con `FormService.getDrafts()`
- Al tocar uno → navegar a `/home/forms/fill/:templateId` (con datos precargados)
- Botón eliminar borrador → `FormService.deleteEntry(id)`

**Servicio a usar:** `FormService` (ya implementado)

---

## Camilo — `feature/history-admin-camilo`

**Archivos a implementar:**
- `app/src/app/history/history-list/history-list.page.ts` + `.html`
- `app/src/app/profile/profile-page/profile.page.ts` + `.html`
- `app/src/app/admin/drone-management/drone-management.page.ts` + `.html`
- `app/src/app/admin/user-management/user-management.page.ts` + `.html`

**Página 1 — Historial (`/home/history`):**
- Listar formularios enviados con `FormService.getSubmitted()`
- Mostrar: nombre del formulario, fecha, estado

**Página 2 — Perfil (`/home/profile`):**
- Mostrar datos del usuario actual (`AuthService.currentUser()`)
- Botón "Cerrar sesión" → `AuthService.logout()`
- Si es admin: botón "Panel admin" → navegar a `/admin/drones`

**Página 3 — Gestión de drones (`/admin/drones`):**
- Listar drones con `DroneService.getAll()`
- Botón agregar drone → formulario en un `ion-alert` o modal
- Swipe o botón para eliminar → `DroneService.delete(id)`
- Indicador de estado: active (verde), maintenance (amarillo), inactive (gris)

**Página 4 — Gestión de usuarios (`/admin/users`):**
- Listar usuarios con `AuthService.getUsers()`
- Mostrar nombre, email, rol con badge de color

**Servicios a usar:** `FormService`, `AuthService`, `DroneService` (ya implementados)
