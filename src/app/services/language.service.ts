import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<string>('');
  currentLang$ = this.currentLang.asObservable();

  constructor(private translate: TranslateService) {
    // Támogatott nyelvek beállítása
    translate.addLangs(['en', 'hu', 'cs']);
    translate.setDefaultLang('en');
    
    // Nyelv beállítása a következő prioritás szerint:
    // 1. Mentett nyelv
    // 2. Böngésző nyelve (ha támogatott)
    // 3. Alapértelmezett (en)
    const savedLang = localStorage.getItem('language');
    const browserLang = translate.getBrowserLang();
    
    let initialLang = 'en';
    if (savedLang && translate.getLangs().includes(savedLang)) {
      initialLang = savedLang;
    } else if (browserLang && translate.getLangs().includes(browserLang)) {
      initialLang = browserLang;
      localStorage.setItem('language', browserLang);
    } else {
      localStorage.setItem('language', 'en');
    }

    translate.use(initialLang);
    this.currentLang.next(initialLang);
  }

  changeLanguage(lang: string) {
    if (this.translate.getLangs().includes(lang)) {
      this.translate.use(lang);
      localStorage.setItem('language', lang);
      this.currentLang.next(lang);
      
      // Frissítjük az oldalt a nyelvi változások érvényesítéséhez
      this.translate.reloadLang(lang).subscribe(() => {
        // Az összes fordítás újratöltődött
        this.translate.use(lang);
      });
    }
  }

  getCurrentLang(): string {
    return this.currentLang.value;
  }
}
