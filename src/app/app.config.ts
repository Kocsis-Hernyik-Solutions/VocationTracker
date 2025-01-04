import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat'; // compat module
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Auth Module for compat
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Firestore Module for compat

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const firebaseConfig = {
  apiKey: "AIzaSyBO3jF0KcegwyGxwl6rJ-pOO-WdJ_AYIyc",
  authDomain: "vocationtracker.firebaseapp.com",
  projectId: "vocationtracker",
  storageBucket: "vocationtracker.firebasestorage.app",
  messagingSenderId: "1073525198226",
  appId: "1:1073525198226:web:5873e0d1968aa6afd6854b"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      AngularFireModule.initializeApp(firebaseConfig), // compat module initialization
      AngularFireAuthModule, // for authentication
      AngularFirestoreModule // for Firestore
    )
  ]
};
