import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatButtonModule,
    TranslateModule
  ],
  template: `
    <div>
      <!-- Your cookie consent template content here -->
    </div>
  `,
  styles: [`
    /* Your styles here */
  `]
})
export class CookieConsentComponent implements OnInit, OnDestroy {
  private readonly COOKIE_KEY = 'cookieConsent';
  private destroy$ = new Subject<void>();
  private snackBarRef: any;

  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    // Feliratkozás a nyelvi változásokra
    this.languageService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.hasUserConsented()) {
          // Ha már van megjelenített snackbar, akkor frissítjük
          if (this.snackBarRef) {
            this.snackBarRef.dismiss();
          }
          this.showConsentBanner();
        }
      });

    // Kezdeti megjelenítés
    setTimeout(() => {
      if (!this.hasUserConsented()) {
        this.showConsentBanner();
      }
    }, 1000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  private hasUserConsented(): boolean {
    return localStorage.getItem(this.COOKIE_KEY) === 'true';
  }

  private showConsentBanner() {
    const message = this.translate.instant('COOKIE.MESSAGE');
    const action = this.translate.instant('COOKIE.ACCEPT');

    this.snackBarRef = this.snackBar.open(message, action, {
      duration: 0,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['cookie-snackbar']
    });

    this.snackBarRef.onAction().subscribe(() => {
      localStorage.setItem(this.COOKIE_KEY, 'true');
      this.snackBarRef.dismiss();
    });
  }
}
