import { Component } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {



  onToggleSidenav(sidenav: MatSidenav){
    sidenav.toggle();
    console.log("nyit");
  }

  close(sidenav: MatSidenav){
    sidenav.close();
  }

  logout(): void {

}

}
