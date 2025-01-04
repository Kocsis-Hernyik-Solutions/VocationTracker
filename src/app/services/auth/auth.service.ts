import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { UserService } from '../firestore/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userId: string;
 
  constructor(private router: Router, private afAuth: AngularFireAuth) {
    this.userLoggedIn.next(false);
      this.userId ="";
  }

  login(email: string, password: string): Promise<any> {
      return this.afAuth.signInWithEmailAndPassword(email, password)
          .then(() => {
              console.log('Auth Service: loginUser: success');
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

  logout() {
    this.userLoggedIn.next(false);
    this.userId ="";
    this.afAuth.signOut();
    this.router.navigate(['/login']);

  }

}
