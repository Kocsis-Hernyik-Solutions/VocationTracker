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
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit{
  signupForm: FormGroup;

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
      position: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    try {
      // Potential initialization logic
      console.log('Profile Component Initialized');
    } catch (error) {
      console.error('Profile Initialization Error', error);
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
        return 'PROFILE.ERRORS.REQUIRED';
      }
      if (control?.hasError('email')) {
        return 'PROFILE.ERRORS.EMAIL';
      }
      if (control?.hasError('minlength')) {
        return 'PROFILE.ERRORS.MIN_LENGTH';
      }
      return '';
    } catch (error) {
      console.error('Error Message Generation Error', error);
      this.errorHandler.handleError(error);
      return 'UNKNOWN_ERROR';
    }
  }

  signup() {
    this.authService.signupUser(this.signupForm.get('email')?.value, this.signupForm.get('password')?.value).then((cred) => {
      console.log(cred);
      const user: User ={
        id: cred.user.uid as string,
        email: this.signupForm.get('email')?.value,
        name: this.signupForm.get('name')?.value,
      }
      this.userService.create(user).then(_ => {
        console.log('hozzáadás sikeres');
        this.router.navigate(['/profile']); 
      }).catch((error: any) => {
        console.log(error);
      })
    }).catch(error =>{
      console.log(error);
    });

  }

}
