import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VacationService } from '../../services/vacation.service';
import { VacationRequest, VacationStatus } from '../../shared/models/VacationRequest';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTooltip } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth/auth.service';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-all-requests',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatTooltip
  ],
  templateUrl: './all-requests.component.html',
  styleUrls: ['./all-requests.component.css']
})
export class AllRequestsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['startDate', 'endDate', 'type', 'status', 'actions'];
  requests: VacationRequest[] = [];
  loading = true;
  error = false;
  private destroy$ = new Subject<void>();

  constructor(
    private vacationService: VacationService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRequests(): void {
    this.loading = true;
    this.error = false;

    this.vacationService.getAllRequests()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (requests: VacationRequest[]) => {
          this.requests = requests;
          this.loading = false;
        },
        error: (error: Error) => {
          console.error('Error loading vacation requests:', error);
          this.error = true;
          this.loading = false;
        }
      });
  }

  updateStatus(requestId: string, status: VacationStatus): void {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) {
      this.showError('VACATION.MESSAGES.AUTH_ERROR');
      return;
    }

    this.vacationService.updateRequestStatus(requestId, status, currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showSuccess('VACATION.MESSAGES.STATUS_UPDATED');
          this.loadRequests();
        },
        error: () => {
          this.showError('VACATION.MESSAGES.STATUS_UPDATE_ERROR');
        }
      });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  private showSuccess(message: string): void {
    this.snackBar.open(this.translate.instant(message), 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(this.translate.instant(message), 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }
}
