import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    NavbarComponent,
    HomeComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    RouterLink,
    MatButtonModule
  ],
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor])),
    JwtHelperService,
    {provide:JWT_OPTIONS, useValue: JWT_OPTIONS},
  ],
  exports: [
    NavbarComponent,
    FooterComponent
  ]
})
export class CoreModule {
  
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
        throw new Error(
            'CoreModule is already loaded. Import it in the AppModule only.');
    }
  }

}
