import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { AppBootstrapModule } from "./app-bootstrap.module";
import { PagesModule } from "./pages/pages.module";
import { MaterialModule } from './material-module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppPipesModule } from "./pipes/app-pipes.module";
import { DirectivesModule } from './directives/directives.module';
import { AlertModule } from '../app/pages/components/alert/alert.module';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareButtonsPopupModule } from 'ngx-sharebuttons/popup';
import { ShareIconsModule } from 'ngx-sharebuttons/icons'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    AppBootstrapModule,
    PagesModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    NgxSkeletonLoaderModule,
    ShareButtonsModule,
    ShareButtonsPopupModule,
    ShareIconsModule,
    AppPipesModule,
    AlertModule,
    DirectivesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
