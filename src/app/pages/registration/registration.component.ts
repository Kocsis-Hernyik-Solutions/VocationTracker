import { CommonModule } from '@angular/common';
import { Component, ErrorHandler, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../services/firestore/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  signupForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandler,
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private userService: UserService
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      position: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    try {
      console.log('Registration Component Initialized');
    } catch (error) {
      console.error('Registration Initialization Error', error);
      this.errorHandler.handleError(error);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    try {
      Object.values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      });
    } catch (error) {
      console.error('Form Touch Error', error);
      this.errorHandler.handleError(error);
    }
  }

  getErrorMessage(controlName: string): string {
    try {
      const control = this.signupForm.get(controlName);
      if (control?.hasError('required')) {
        return 'This field is required';
      }
      if (control?.hasError('email')) {
        return 'Please enter a valid email address';
      }
      if (control?.hasError('minlength')) {
        return controlName === 'password' 
          ? 'Password must be at least 6 characters long'
          : 'Must be at least 2 characters long';
      }
      return '';
    } catch (error) {
      console.error('Error Message Generation Error', error);
      this.errorHandler.handleError(error);
      return 'An error occurred';
    }
  }

  async signup() {
    if (this.signupForm.valid) {
      try {
        const { email, password, name, position, department } = this.signupForm.value;
        
        // First create the user in Firebase Auth
        const credential = await this.authService.signupUser(email, password);
        
        if (credential && credential.user) {
          // Then create the user document in Firestore
          const user: User = {
            id: credential.user.uid,
            email: email,
            name: name,
            post: position,
            department: department,
            avaiable_days_off: 0,
            taken_days: 0,
            leader: false,
            admin: false
          };
          
          await this.userService.create(user);
          
          // Show success message
          this.snackBar.open('Registration successful! Please log in.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });

          // Sign out the user (since we want them to log in explicitly)
          await this.authService.logout();
          
          // Navigate to login
          this.router.navigate(['/login']);
        }
      } catch (error: any) {
        console.error('Registration error:', error);
        let errorMessage = 'Registration failed';
        
        // Handle specific Firebase Auth errors
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.code === 'auth/operation-not-allowed') {
          errorMessage = 'Email/password registration is not enabled. Please contact support.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Please choose a stronger password.';
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    } else {
      this.markFormGroupTouched(this.signupForm);
    }
  }
}
