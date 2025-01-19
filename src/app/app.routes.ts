import { Routes } from '@angular/router';
import { AuthGuardService } from './services/auth/auth.guard.service';
import { NonAuthGuardService } from './services/auth/non-auth.guard.service';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [NonAuthGuardService]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'registration',
    loadComponent: () => import('./pages/auth/registration/registration.component').then(m => m.RegistrationComponent),
    canActivate: [NonAuthGuardService]
  },
  {
    path: 'vacation/request',
    loadComponent: () => import('./pages/vacation/request/request.component').then(m => m.RequestComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'all-requests',
    loadChildren: () => import('./pages/all-requests/all-requests.module').then(m => m.AllRequestsModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'department',
    loadChildren: () => import('./pages/department/department.module').then(m => m.DepartmentModule),
    
  },
  {
    path: 'employee',
    loadChildren: () => import('./pages/employee/employee.module').then(m => m.EmployeeModule),
    
  },
  {
    path: '404',
    loadComponent: () => import('./pages/error/error404/error404.component').then(m => m.Error404Component)
  },
  { path: '**', redirectTo: '404' }
];
