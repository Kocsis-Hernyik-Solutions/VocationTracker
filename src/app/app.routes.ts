import { Routes } from '@angular/router';
import { LoggedOutGuard } from './guards/logged-out.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [LoggedOutGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/registration/registration.component').then(m => m.RegisterComponent),
    canActivate: [LoggedOutGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];
