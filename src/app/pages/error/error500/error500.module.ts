import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Error500Component } from './error500.component';

const routes: Routes = [
  {
    path: '',
    component: Error500Component
  }
];

@NgModule({
  declarations: [Error500Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class Error500Module { }
