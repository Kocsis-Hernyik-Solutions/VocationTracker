import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CookieConsentComponent } from './shared/cookie-consent/cookie-consent.component';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenuComponent,
    FooterComponent,
    CookieConsentComponent
  ],
  template: `
    <app-menu>
      <router-outlet></router-outlet>
    </app-menu>
    <app-footer></app-footer>
    <app-cookie-consent></app-cookie-consent>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  constructor(private languageService: LanguageService) {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.languageService.changeLanguage(savedLang);
    }
  }
}
