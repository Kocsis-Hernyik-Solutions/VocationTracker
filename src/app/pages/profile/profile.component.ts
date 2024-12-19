import { Component, OnInit, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
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
  ]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandler
  ) {
    this.profileForm = this.fb.group({
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

  onSubmit(): void {
    try {
      if (this.profileForm.valid) {
        // Save profile data here when you have a user service
        // this.userService.updateProfile(this.profileForm.value);
        
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      } else {
        this.markFormGroupTouched(this.profileForm);
      }
    } catch (error) {
      console.error('Profile Submit Error', error);
      this.errorHandler.handleError(error);
    }
  }

  onCancel(): void {
    try {
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Navigation Error', error);
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
      const control = this.profileForm.get(controlName);
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
}
