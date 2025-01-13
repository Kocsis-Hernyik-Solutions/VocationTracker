import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';
import { LanguageService } from './services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from './services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    RouterOutlet,
    MenuComponent,
    FooterComponent,
    CookieConsentComponent,
    TranslateModule
  ],
  standalone: true
})
export class AppComponent {
  constructor(
    private languageService: LanguageService,
    public authService: AuthService
  ) {}
}
