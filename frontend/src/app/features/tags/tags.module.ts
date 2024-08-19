import { NgModule } from '@angular/core';
import { TagViewerComponent } from './components/tag-viewer/tag-viewer.component';
import { SharedModule } from '../../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { Features } from '../features.enum';
import { tagsReducer } from './state/tags.reducer';
import { EffectsModule } from '@ngrx/effects';
import * as tagsEffects from '../tags/state/tags.effects';
import { ManageTagsPageComponent } from './components/manage-tags-page/manage-tags-page.component';


@NgModule({
  declarations: [
    TagViewerComponent,
    ManageTagsPageComponent
  ],
  imports: [
    SharedModule,
    StoreModule.forFeature(Features.Tags, tagsReducer),
    EffectsModule.forFeature(tagsEffects),
  ],
  exports: [
    TagViewerComponent
  ]
})
export class TagsModule { }
