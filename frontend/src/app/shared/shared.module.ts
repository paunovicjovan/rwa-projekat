import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { FormatDatePipe } from './pipes/format-date/format-date.pipe';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { TranslateRolePipe } from './pipes/translate-role/translate-role.pipe';

const modules = [
  CommonModule,
  RouterModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  FormsModule,
  ReactiveFormsModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatIconModule,
  MatPaginatorModule,
  MatBadgeModule,
  MatSelectModule,
  ImageCropperComponent
]

@NgModule({
  declarations: [
    FormatDatePipe,
    TranslateRolePipe
  ],
  imports: [
    ...modules
  ],
  exports: [
    ...modules,
    FormatDatePipe,
    TranslateRolePipe
  ]
})
export class SharedModule { }
