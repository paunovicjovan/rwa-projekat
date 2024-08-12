import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CoreModule } from './core/core.module';
import { AuthModule } from './features/auth/auth.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { UsersModule } from './features/users/users.module';
import { metaReducers } from './state/local-storage.metareducer';
import { ProjectsModule } from './features/projects/projects.module';
import { ReviewsModule } from './features/reviews/reviews.module';
import { TagsModule } from './features/tags/tags.module';
import { provideNativeDateAdapter } from '@angular/material/core';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    AuthModule,
    UsersModule,
    ReviewsModule, 
    TagsModule,
    ProjectsModule,
    StoreModule.forRoot({}, {
      metaReducers
    }),
    StoreDevtoolsModule.instrument({ maxAge: 100, logOnly: !isDevMode() }),
    EffectsModule.forRoot([])
  ],
  providers: [
    provideAnimationsAsync(),
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
