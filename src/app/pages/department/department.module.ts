import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { DepartmentComponent } from './department.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatTableModule, MatFormFieldModule,
        RouterModule.forChild([
          {
            path: '',
            component: DepartmentComponent
          }
        ])
  ]
})
export class DepartmentModule { }
