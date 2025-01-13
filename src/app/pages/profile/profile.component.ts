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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/firestore/user.service';
import { User } from '../../shared/models/User';

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
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = true;
  saving = false;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandler,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.loading = true;
      const userId = this.authService.userId;
      if (userId) {
        this.currentUser = await this.userService.getById(userId);
        if (this.currentUser) {
          this.profileForm.patchValue({
            name: this.currentUser.name,
            email: this.currentUser.email,
            position: this.currentUser.position || '',
            department: this.currentUser.department || ''
          });
        }
      }
    } catch (error) {
      console.error('Profile Load Error', error);
      this.errorHandler.handleError(error);
      this.snackBar.open('Failed to load profile data', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    } finally {
      this.loading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.valid && !this.saving) {
      try {
        this.saving = true;
        const userId = this.authService.userId;
        if (!userId) {
          throw new Error('No user ID found');
        }

        const updatedUser: User = {
          id: userId,
          ...this.profileForm.value
        };

        await this.userService.update(updatedUser);
        
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      } catch (error) {
        console.error('Profile Update Error', error);
        this.errorHandler.handleError(error);
        this.snackBar.open('Failed to update profile', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      } finally {
        this.saving = false;
      }
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  getErrorMessage(field: string): string {
    const control = this.profileForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      return field === 'name' 
        ? 'Name must be at least 2 characters long'
        : 'Must be at least 2 characters long';
    }
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
