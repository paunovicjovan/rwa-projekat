import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    RouterLink,
    MatButtonModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class CoreModule { }
