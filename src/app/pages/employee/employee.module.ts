import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabContent, MatTabsModule } from '@angular/material/tabs';
import { EmployeeComponent } from './employee.component';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTabsModule,
    MatTabContent,
    RouterModule.forChild([
      {
        path: '',
        component: EmployeeComponent
      }
    ])
  ]
})
export class EmployeeModule { }
