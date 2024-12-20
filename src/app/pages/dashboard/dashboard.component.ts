import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { TeamCalendarComponent } from '../../components/team-calendar/team-calendar.component';

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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CalendarComponent,
    TeamCalendarComponent
  ]
})
export class DashboardComponent implements OnInit {
  userName: string = 'John Doe'; // TODO: Get from auth service
  currentTime: Date = new Date();
  currentDate: Date = new Date();
  remainingDays: number = 10;
  isDarkMode: boolean;
  
  pendingRequests: VacationRequest[] = [
    {
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-20'),
      status: 'pending'
    },
    {
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-05'),
      status: 'approved'
    }
  ];

  notifications: Notification[] = [
    {
      message: 'Elfogadták a szabadságkérelmedet',
      time: new Date(),
      icon: 'check-circle'
    },
    {
      message: 'Emlékeztető: Nyújtsd be az éves szabadságtervet!',
      time: new Date(),
      icon: 'info-circle'
    }
  ];

  constructor(private router: Router) {
    // Ellenőrizzük a mentett téma beállítást vagy az operációs rendszer beállítását
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // Ha nincs mentett beállítás, ellenőrizzük az OS beállítást
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.updateTheme();

    // Figyeljük az OS téma változását
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        this.isDarkMode = e.matches;
        this.updateTheme();
      }
    });
  }

  ngOnInit() {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 60000); // Update every minute
  }

  updateDateTime() {
    this.currentTime = new Date();
    this.currentDate = new Date();
  }

  requestVacation() {
    this.router.navigate(['/vacation/request']);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.updateTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private updateTheme() {
    document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
    // Frissítjük a meta theme-color-t is a modern böngészőkhöz
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', this.isDarkMode ? '#121212' : '#FFFFFF');
    }
  }
}
