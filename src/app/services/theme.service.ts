import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(localStorage.getItem('isDarkTheme') === 'true');
  isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor() {
    this.applyTheme(this.isDarkTheme.value);
  }

  toggleTheme(): void {
    const newValue = !this.isDarkTheme.value;
    localStorage.setItem('isDarkTheme', newValue.toString());
    this.isDarkTheme.next(newValue);
    this.applyTheme(newValue);
  }

  private applyTheme(isDark: boolean): void {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(isDark ? 'dark-theme' : 'light-theme');
  }
}
