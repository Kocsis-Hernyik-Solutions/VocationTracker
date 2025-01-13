import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/firestore/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    TranslateModule,
    RouterLink
  ],
  providers: [AuthService],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  currentLang: string = 'en';
  userName: string = '';

  constructor(
    public themeService: ThemeService,
    private languageService: LanguageService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.currentLang = this.languageService.getCurrentLang();
    this.authService.currentUser.subscribe(async user => {
      if (user) {
        const userData = await this.userService.getById(user.uid);
        if (userData) {
          this.userName = userData.name || user.email || '';
        } else {
          this.userName = user.email || '';
        }
      }
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  changeLanguage(lang: string) {
    this.languageService.changeLanguage(lang);
    this.currentLang = lang;
  }

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
