import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  userLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private auth: Auth,
    private router: Router,
    private userService: UserService
  ) {
    this.auth.onAuthStateChanged(user => {
      this.currentUserSubject.next(user);
      this.userLoggedIn.next(!!user);
    });
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      if (result.user) {
        // Check if user exists in Firestore, if not create them
        const userDoc = await this.userService.getById(result.user.uid);
        if (!userDoc) {
          await this.userService.createUser(result.user.uid, {
            email: result.user.email!,
            name: result.user.displayName || 'User',
            role: 'user',
            remainingDays: 20,
            position: '',
            department: '',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signupUser(email: string, password: string): Promise<User> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }
}
