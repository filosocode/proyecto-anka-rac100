import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const required: string = route.data['role'];
  if (auth.currentUser()?.role === required) return true;
  router.navigate(['/forms']);
  return false;
};
