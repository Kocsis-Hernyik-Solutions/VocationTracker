import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(
      m => m.ProfileModule,
      error => {
        console.error('Profile Module Loading Error', error);
        throw error;
      }
    )
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      preloadingStrategy: PreloadAllModules,
      enableTracing: true  // Enable routing logs
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
