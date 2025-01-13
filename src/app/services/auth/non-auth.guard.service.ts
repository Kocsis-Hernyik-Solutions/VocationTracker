import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class NonAuthGuardService implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router,
    private afAuth: AngularFireAuth
  ) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => !user),
      tap(notLoggedIn => {
        if (!notLoggedIn) {
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }
}
