import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface User {
  email: string;
  name: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    // Always return successful login
    const mockUser: User = {
      email: email,
      name: email.split('@')[0]
    };

    const response: LoginResponse = {
      success: true,
      user: mockUser
    };

    return of(response).pipe(
      tap(response => {
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        this.currentUserSubject.next(mockUser);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
