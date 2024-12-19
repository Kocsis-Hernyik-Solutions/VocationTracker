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
import { RouterModule, Routes } from '@angular/router';

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
    RouterModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  currentLang: string = 'en';

  constructor(
    public themeService: ThemeService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.currentLang = this.languageService.getCurrentLang();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  changeLanguage(lang: string) {
    this.languageService.changeLanguage(lang);
    this.currentLang = lang;
  }
}
