import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UserService } from '../firestore/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userId: string;
  currentUser: Observable<any>;
 
  constructor(private router: Router, private afAuth: AngularFireAuth) {
    this.userLoggedIn.next(false);
    this.userId = "";
    this.currentUser = this.afAuth.authState;
    
    // Subscribe to Firebase auth state changes
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userLoggedIn.next(true);
        this.userId = user.uid;
      } else {
        this.userLoggedIn.next(false);
        this.userId = "";
      }
    });
  }

  login(email: string, password: string): Promise<any> {
      return this.afAuth.signInWithEmailAndPassword(email, password)
          .then(() => {
              console.log('Auth Service: loginUser: success');
              this.userLoggedIn.next(true);
              // this.router.navigate(['/dashboard']);
          })
          .catch((error) => {
              console.log('Auth Service: login error...');
              console.log('error code', error.code);
              console.log('error', error);
              if (error.code)
                  return { isValid: false, message: error.message };
                  return { isValid: false, message: error.message };
          });
  }

  signupUser(email: string, password: string): Promise<any> {
      return this.afAuth.createUserWithEmailAndPassword(email, password);         
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.userLoggedIn.next(false);
      this.userId = "";
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  isLoggedIn(): boolean {
    return this.userLoggedIn.value;
  }

}
