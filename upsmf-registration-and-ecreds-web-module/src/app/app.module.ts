import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from '../../src/app/material/material.module';

import { BaseInterceptorInterceptor } from './services/base-interceptor.interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: BaseInterceptorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
