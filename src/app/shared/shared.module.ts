import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlertService } from './alert/sweetalert.service';
import { LoginService } from '../login/loginservice';
import { CategoryService } from '../admin/category/category.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  entryComponents: [],
  exports: [],
  providers: [
    SweetAlertService,
    LoginService,
    DatePipe,
    CategoryService
  ]
})
export class SharedModule { }
