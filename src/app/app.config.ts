import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

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
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(),
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideFirestore(() => getFirestore())
  ]
};
