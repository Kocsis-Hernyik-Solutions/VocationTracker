import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VacationService } from '../../../services/vacation.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    TranslateModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  requestForm: FormGroup;
  types = [
    { value: 'annual', label: 'VACATION.TYPES.ANNUAL' },
    { value: 'sick', label: 'VACATION.TYPES.SICK' },
    { value: 'unpaid', label: 'VACATION.TYPES.UNPAID' }
  ];

  constructor(
    private fb: FormBuilder,
    private vacationService: VacationService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.requestForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.requestForm.valid) {
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        this.showError('VACATION.ERRORS.NOT_AUTHENTICATED');
        return;
      }

      const request = {
        ...this.requestForm.value,
        userId,
        status: 'pending',
        createdAt: new Date()
      };

      this.vacationService.createRequest(request).subscribe({
        next: () => {
          this.showSuccess('VACATION.MESSAGES.REQUEST_SUBMITTED');
          this.requestForm.reset();
        },
        error: () => {
          this.showError('VACATION.MESSAGES.REQUEST_ERROR');
        }
      });
    }
  }

  private showSuccess(message: string): void {
    this.translate.get(message).subscribe(text => {
      this.snackBar.open(text, undefined, {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    });
  }

  private showError(message: string): void {
    this.translate.get(message).subscribe(text => {
      this.snackBar.open(text, undefined, {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    });
  }
}
