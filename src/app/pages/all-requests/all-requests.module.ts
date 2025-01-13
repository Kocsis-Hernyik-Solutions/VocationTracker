import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AllRequestsComponent } from './all-requests.component';

const routes: Routes = [
  {
    path: '',
    component: AllRequestsComponent
  }
];

@NgModule({
  declarations: [
    AllRequestsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes)
  ]
})
export class AllRequestsModule { }
