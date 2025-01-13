import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { VacationService } from '../../services/vacation.service';
import { VacationRequest, RequestStatus } from '../../models/vacation-request.model';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import huLocale from '@fullcalendar/core/locales/hu';

interface ExtendedProps {
  status: RequestStatus;
  type: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, TranslateModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  private themeSubscription: Subscription;
  private languageSubscription: Subscription;
  private currentTheme: boolean = false;
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [],
    locale: huLocale,
    eventClassNames: function(arg) {
      const props = arg.event.extendedProps as ExtendedProps;
      return [`vacation-${props.status.toLowerCase()}`];
    },
    eventContent: function(arg) {
      const props = arg.event.extendedProps as ExtendedProps;
      return {
        html: `
          <div class="vacation-event">
            <div class="vacation-title">${arg.event.title}</div>
            <div class="vacation-status">${props.status}</div>
          </div>
        `
      };
    }
  };

  constructor(
    private vacationService: VacationService,
    private themeService: ThemeService,
    private translateService: TranslateService
  ) {
    // Feliratkozás a téma változásra
    this.themeSubscription = this.themeService.isDarkTheme$.subscribe(isDark => {
      this.currentTheme = isDark;
      this.updateCalendarTheme(isDark);
    });

    // Feliratkozás a nyelv változásra
    this.languageSubscription = this.translateService.onLangChange.subscribe(() => {
      this.updateCalendarTranslations();
    });
  }

  ngOnInit(): void {
    this.loadVacationRequests();
    this.updateCalendarTranslations();
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  private loadVacationRequests(): void {
    this.vacationService.getUserRequests().subscribe({
      next: (requests) => {
        const events: EventInput[] = this.convertRequestsToEvents(requests);
        this.calendarOptions.events = events;
      },
      error: (error) => {
        console.error('Error loading vacation requests:', error);
      }
    });
  }

  private convertRequestsToEvents(requests: VacationRequest[]): EventInput[] {
    return requests.map(request => ({
      title: 'Vacation',
      start: request.startDate,
      end: request.endDate,
      extendedProps: {
        status: request.status,
        type: request.type
      },
      backgroundColor: this.getEventColor(request.status),
      borderColor: this.getEventColor(request.status),
      textColor: 'var(--text-color)'
    }));
  }

  private getEventColor(status: RequestStatus): string {
    switch (status) {
      case RequestStatus.APPROVED:
        return 'var(--success-color)';
      case RequestStatus.PENDING:
        return 'var(--warn-color)';
      case RequestStatus.REJECTED:
        return 'var(--error-color)';
      default:
        return 'var(--secondary-text-color)';
    }
  }

  private updateCalendarTranslations(): void {
    // Lefordítjuk a szükséges szövegeket
    this.translateService.get([
      'CALENDAR.BUTTONS.TODAY',
      'CALENDAR.BUTTONS.MONTH',
      'CALENDAR.DAYS.MONDAY',
      'CALENDAR.DAYS.TUESDAY',
      'CALENDAR.DAYS.WEDNESDAY',
      'CALENDAR.DAYS.THURSDAY',
      'CALENDAR.DAYS.FRIDAY',
      'CALENDAR.DAYS.SATURDAY',
      'CALENDAR.DAYS.SUNDAY'
    ]).subscribe(translations => {
      const commonOptions: Partial<CalendarOptions> = {
        buttonText: {
          today: translations['CALENDAR.BUTTONS.TODAY'],
          month: translations['CALENDAR.BUTTONS.MONTH']
        },
        dayHeaderFormat: { weekday: 'long' },
        locale: this.translateService.currentLang === 'hu' ? huLocale : undefined
      };

      this.calendarOptions = {
        ...this.calendarOptions,
        ...commonOptions
      };
    });
  }

  private updateCalendarTheme(isDark: boolean): void {
    const isMobile = window.innerWidth <= 768;
    
    const commonOptions: Partial<CalendarOptions> = {
      height: 'auto',
      headerToolbar: {
        left: isMobile ? 'prev,next' : 'prev,next today',
        center: 'title',
        right: 'dayGridMonth'
      },
      themeSystem: 'standard',
      contentHeight: 'auto',
      // Közös stílusok
      eventTextColor: 'var(--text-color)',
      titleFormat: { 
        year: 'numeric', 
        month: isMobile ? 'short' : 'long'
      },
      // Gombok stílusa
      buttonIcons: {
        prev: 'chevron-left',
        next: 'chevron-right'
      },
      views: {
        dayGridMonth: {
          dayMaxEventRows: isMobile ? 2 : 3,
          dayMaxEvents: isMobile ? 2 : 3,
          eventMinHeight: isMobile ? 20 : 25
        }
      }
    };

    const darkThemeOptions: Partial<CalendarOptions> = {
      ...commonOptions,
      // Sötét téma specifikus beállítások
      // Háttérszínek
      eventBackgroundColor: 'var(--calendar-event-bg-dark)',
      eventBorderColor: 'var(--calendar-event-border-dark)',
      // Szövegszínek
      eventTextColor: 'var(--text-color)',
      // Fejléc és cella színek
      views: {
        dayGrid: {
          backgroundColor: 'var(--calendar-bg-dark)',
          borderColor: 'var(--calendar-border-dark)',
          textColor: 'var(--text-color)'
        }
      }
    };

    const lightThemeOptions: Partial<CalendarOptions> = {
      ...commonOptions,
      // Világos téma specifikus beállítások
      eventBackgroundColor: 'var(--calendar-event-bg)',
      eventBorderColor: 'var(--calendar-event-border)',
      // Szövegszínek
      eventTextColor: 'var(--text-color)',
      // Fejléc és cella színek
      views: {
        dayGrid: {
          backgroundColor: 'var(--calendar-bg)',
          borderColor: 'var(--calendar-border)',
          textColor: 'var(--text-color)'
        }
      }
    };

    this.calendarOptions = {
      ...this.calendarOptions,
      ...(isDark ? darkThemeOptions : lightThemeOptions)
    };
  }

  @HostListener('window:resize')
  onResize() {
    this.updateCalendarTheme(this.currentTheme);
  }
}
