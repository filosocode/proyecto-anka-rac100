import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { adminGuard } from './auth/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.page').then(m => m.LoginPage),
  },

  {
    path: 'recuperar-contrasena',
    loadComponent: () =>
      import('./auth/recover/recover.page').then(m => m.RecoverPage),
  },

  // Rutas del piloto con tabs (requiere autenticación)
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/home-tabs.page').then(m => m.HomeTabsPage),
    children: [
      { path: '', redirectTo: 'forms', pathMatch: 'full' },
      {
        path: 'forms',
        loadComponent: () =>
          import('./forms/form-list/form-list.page').then(m => m.FormListPage),
      },
      {
        path: 'forms/fill/:id',
        loadComponent: () =>
          import('./forms/form-fill/form-fill.page').then(m => m.FormFillPage),
      },
      {
        path: 'forms/draft',
        loadComponent: () =>
          import('./forms/form-draft/form-draft.page').then(m => m.FormDraftPage),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./history/history-list/history-list.page').then(m => m.HistoryListPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile-page/profile.page').then(m => m.ProfilePage),
      },
    ],
  },

  // Rutas del administrador con tabs (requiere autenticación + rol admin)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./admin/admin-tabs/admin-tabs.page').then(m => m.AdminTabsPage),
    children: [
      { path: '', redirectTo: 'drones', pathMatch: 'full' },
      {
        path: 'drones',
        loadComponent: () =>
          import('./admin/drone-management/drone-management.page').then(m => m.DroneManagementPage),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/user-management/user-management.page').then(m => m.UserManagementPage),
      },
      {
        path: 'forms',
        loadComponent: () =>
          import('./admin/form-management/form-management.page').then(m => m.FormManagementPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile-page/profile.page').then(m => m.ProfilePage),
      },
    ],
  },

  // Ruta fuera del tabs para tener header propio con botón de regreso
  {
    path: 'admin/forms/:id/fields',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./admin/form-fields/form-fields.page').then(m => m.FormFieldsPage),
  },

  { path: '**', redirectTo: '/login' },
];