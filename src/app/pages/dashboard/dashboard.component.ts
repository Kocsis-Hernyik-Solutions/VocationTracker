import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { VacationService } from '../../services/vacation.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil, switchMap, filter } from 'rxjs/operators';
import { User as FirebaseUser } from '@angular/fire/auth';

interface VacationRequest {
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

interface Notification {
  message: string;
  time: Date;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    TranslateModule,
    CalendarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  userName: string = '';
  currentTime: Date = new Date();
  currentDate: Date = new Date();
  remainingDays: number = 20;
  pendingRequests: VacationRequest[] = [];
  notifications: Notification[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private vacationService: VacationService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Update time every minute
    interval(60000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentTime = new Date();
      });

    // Load user data
    this.authService.getCurrentUser()
      .pipe(
        takeUntil(this.destroy$),
        filter((user: FirebaseUser | null): user is FirebaseUser => !!user),
        switchMap(user => this.userService.getUserById(user.uid))
      )
      .subscribe(userData => {
        if (userData) {
          this.userName = userData.name || userData.email;
          this.remainingDays = userData.remainingDays || 20;
          this.loadUserRequests(userData.id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  requestVacation(): void {
    this.router.navigate(['/vacation/request']);
  }

  requestAllRequests(): void {
    this.router.navigate(['/all-requests']);
  }

  private loadUserRequests(userId: string): void {
    this.vacationService.getUserRequests(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(requests => {
        this.pendingRequests = requests.filter(req => req.status === 'pending');
      });
  }
}
