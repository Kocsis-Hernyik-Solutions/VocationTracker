import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VacationService } from '../../services/vacation.service';
import { VacationRequest } from '../../shared/models/VacationRequest';
import { AuthService } from '../../services/auth/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import huLocale from '@fullcalendar/core/locales/hu';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    TranslateModule,
    FullCalendarModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  requests: VacationRequest[] = [];
  loading = true;
  error = false;
  private readonly destroy$ = new Subject<void>();

  private readonly defaultCalendarConfig: Partial<CalendarOptions> = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [],
    locale: huLocale,
    height: 'auto',
    displayEventTime: false,
    dayHeaderContent: this.createDayHeaderContent(),
    dayCellContent: this.createDayCellContent(),
    dayHeaderClassNames: this.createDayHeaderClassNames(),
    dayCellClassNames: this.createDayCellClassNames(),
    eventClassNames: (arg) => [`vacation-${arg.event.extendedProps['status']}`],
    dayCellDidMount: (arg) => {
      const cell = arg.el;
      
      // Add base class
      cell.classList.add('calendar-cell');
      // Add event listeners
      cell.addEventListener('mouseenter', () => {
        cell.classList.add('calendar-cell-hover');
      });

      cell.addEventListener('mouseleave', () => {
        cell.classList.remove('calendar-cell-hover');
      });
    }
  };

  calendarOptions: CalendarOptions = {
    ...this.defaultCalendarConfig,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'today'
    }
  };

  constructor(
    private readonly vacationService: VacationService,
    private readonly authService: AuthService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initializeCalendar();
    this.setupLanguageSubscription();
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeCalendar(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      buttonText: {
        today: this.translate.instant('CALENDAR.BUTTONS.TODAY')
      },
      dayHeaderFormat: {
        weekday: 'short'
      }
    };
  }

  private setupLanguageSubscription(): void {
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateCalendarLanguage());
  }

  private loadUserData(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.loadUserRequests(userId);
    }
  }

  private loadUserRequests(userId: string): void {
    this.loading = true;
    this.error = false;

    this.vacationService.getUserRequests(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (requests: VacationRequest[]) => {
          this.requests = requests;
          this.updateCalendarEvents(requests);
          this.loading = false;
        },
        error: (error: Error) => {
          console.error('Error loading vacation requests:', error);
          this.error = true;
          this.loading = false;
        }
      });
  }

  private createDayHeaderContent() {
    return (arg: any) => {
      const cellStyle = `
        color: black;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      `;
      return {
        html: `<div style="${cellStyle}">${arg.text}</div>`
      };
    };
  }

  private createDayCellContent() {
    return (arg: any) => {
      const isWeekend = arg.date.getDay() === 0 || arg.date.getDay() === 6;
      const color = isWeekend ? 'var(--secondary-text-color)' : 'var(--text-color)';
      const style = `
        color: ${color};
        width: 100%;
        height: 100%;
        display: block;
        padding: 4px;
      `;
      return {
        html: `<div class="fc-daygrid-day-number" style="${style}">${arg.dayNumberText}</div>`
      };
    };
  }

  private createDayHeaderClassNames() {
    return (arg: any) => {
      const classes = ['calendar-day-header'];
      if (arg.dow === 0 || arg.dow === 6) {
        classes.push('calendar-day-weekend');
      }
      return classes;
    };
  }

  private createDayCellClassNames() {
    return (arg: any) => {
      const classes = ['calendar-day'];
      if (arg.isToday) {
        classes.push('calendar-day-today');
      }
      if (arg.isPast || arg.isFuture) {
        classes.push('calendar-day-other-month');
      }
      if (arg.date.getDay() === 0 || arg.date.getDay() === 6) {
        classes.push('calendar-day-weekend');
      }
      return classes;
    };
  }

  private updateCalendarEvents(requests: VacationRequest[]): void {
    const events: EventInput[] = requests.map(request => ({
      title: this.getEventTitle(request.type),
      start: request.startDate,
      end: request.endDate,
      extendedProps: {
        status: request.status,
        type: request.type
      },
      backgroundColor: this.getEventColor(request.status),
      borderColor: this.getEventColor(request.status)
    }));

    this.calendarOptions = {
      ...this.calendarOptions,
      events
    };
  }

  private updateCalendarLanguage(): void {
    const currentLang = this.translate.currentLang;
    this.calendarOptions = {
      ...this.calendarOptions,
      locale: currentLang === 'hu' ? huLocale : 'en',
      buttonText: {
        today: this.translate.instant('CALENDAR.BUTTONS.TODAY')
      }
    };
  }

  private getEventTitle(type: string): string {
    return this.translate.instant(`VACATION.TYPES.${type.toUpperCase()}`);
  }

  private getEventColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'var(--success-color, #4caf50)';
      case 'pending':
        return 'var(--warning-color, #ff9800)';
      case 'rejected':
        return 'var(--error-color, #f44336)';
      default:
        return 'var(--primary-color, #2196f3)';
    }
  }
}
