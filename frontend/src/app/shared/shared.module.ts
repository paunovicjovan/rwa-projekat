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
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import * as sharedEffects from './state/shared.effects';
import { EffectsModule } from '@ngrx/effects';
import { AvatarImageComponent } from './components/avatar-image/avatar-image.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  ImageCropperComponent,
  MatDialogModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatTooltipModule
]

@NgModule({
  declarations: [
    FormatDatePipe,
    TranslateRolePipe,
    ConfirmDialogComponent,
    AvatarImageComponent
  ],
  imports: [
    ...modules,
    EffectsModule.forFeature(sharedEffects)
  ],
  exports: [
    ...modules,
    FormatDatePipe,
    TranslateRolePipe,
    ConfirmDialogComponent,
    AvatarImageComponent
  ]
})
export class SharedModule { }
