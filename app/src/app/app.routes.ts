import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { roleGuard } from './auth/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'forms',
    canActivate: [authGuard],
    loadComponent: () => import('./forms/form-list/form-list.page').then(m => m.FormListPage),
  },
  {
    path: 'forms/fill/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./forms/form-fill/form-fill.page').then(m => m.FormFillPage),
  },
  {
    path: 'forms/drafts',
    canActivate: [authGuard],
    loadComponent: () => import('./forms/form-draft/form-draft.page').then(m => m.FormDraftPage),
  },
  {
    path: 'history',
    canActivate: [authGuard],
    loadComponent: () => import('./history/history-list/history-list.page').then(m => m.HistoryListPage),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./profile/profile-page/profile.page').then(m => m.ProfilePage),
  },
  {
    path: 'admin/users',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadComponent: () => import('./admin/user-management/user-management.page').then(m => m.UserManagementPage),
  },
  {
    path: 'admin/drones',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadComponent: () => import('./admin/drone-management/drone-management.page').then(m => m.DroneManagementPage),
  },
];
