import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load user data here when you have a user service
    // this.loadUserData();
  }

  onSubmit(): void {
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
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
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
  }
}
