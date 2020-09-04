import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowErrorsComponent } from '../show-errors/show-errors.component';

@NgModule({
  declarations: [ShowErrorsComponent],
  imports: [
    CommonModule
  ], exports: [ShowErrorsComponent]
})
export class CommonComponentModule { }
