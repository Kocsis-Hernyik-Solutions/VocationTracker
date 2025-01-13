import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from './environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AuthGuardService } from './app/services/auth/auth.guard.service';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./app/pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./app/pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./app/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuardService]
  },
  {
    path: 'registration',
    loadComponent: () => import('./app/pages/registration/registration.component').then(m => m.RegistrationComponent)
  },
  {
    path: 'department',
    loadComponent: () => import('./app/pages/department/department.component').then(m => m.DepartmentComponent)
  },
  { path: '404', loadComponent: () => import('./app/pages/error/error404/error404.component').then(m => m.Error404Component) },
  { path: '500', loadComponent: () => import('./app/pages/error/error500/error500.component').then(m => m.Error500Component) },
  { path: '**', redirectTo: '404' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(
      MatSnackBarModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      }),
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireAuthModule // Firebase Authentication modul
    ),
    provideFirebaseApp(() => initializeApp(environment.firebase)), // Firebase inicializáció
    provideAuth(() => getAuth()), // Firebase Auth szolgáltatás
    provideFirestore(() => getFirestore()), // Firestore szolgáltatás
  ]
});
