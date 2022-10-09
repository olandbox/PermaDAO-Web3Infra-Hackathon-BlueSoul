import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { ext } from './constants/lands';
import { AboutComponent } from './pages/about/about.component';

import { ErrorComponent } from "./pages/error/error.component";
import { HomeComponent } from './pages/home/home.component';
import { LandsEditComponent } from './pages/lands/lands-edit.component';
import { LandsSimpleComponent } from './pages/lands/lands-simple.component';
import { LandsComponent } from './pages/lands/lands.component';
import { OlandComponent } from './pages/layout/oland/oland.component';

const routes: Routes = [
  
  { path: '', pathMatch: 'full', redirectTo: 'oland/r' },
  { path: 'oland/r', 
    component: OlandComponent,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },

  { path: ':name/edit', component: OlandComponent, children: [{
    path: '', pathMatch: 'full', component: LandsEditComponent
  }] },
  { matcher: findMatchDetailUrl, component: OlandComponent, children: [{
    path: '', pathMatch: 'full', component: LandsComponent
  }] },
  { matcher: findMatchShareUrl, component: LandsSimpleComponent },

];

function findMatchEditUrl(url: UrlSegment[]): UrlMatchResult {
  if (url.length === 2 && url[1].path === 'edit') {
    return {
      consumed: url,
      posParams: {path: new UrlSegment(url[0].path, {})}
    };
  } else {
    return null;
  }
}

function findMatchDetailUrl(url: UrlSegment[]): UrlMatchResult{
  if (url.length === 0) {
    return null;
  } 
  if (url.length === 1) {
    const nameArray = decodeURI(url[0].path).split('.');
    const details = [ext.detail_private, ext.detail_public, ext.detail_verify];
    if (details.includes(nameArray[1])) {
      return {
        consumed: url,
        posParams: {path: new UrlSegment(url[0].path, {})}
      };
    } else {
      return null;
    }
  }
}
function findMatchShareUrl(url: UrlSegment[]): UrlMatchResult{
  if (url.length === 0) {
    return null;
  } 
  if (url.length === 1) {
    const nameArray = decodeURI(url[0].path).split('.');
    const details = [ext.detail_private, ext.detail_public, ext.detail_verify];
    if (!details.includes(nameArray[1])) {
      return {
        consumed: url,
        posParams: {path: new UrlSegment(url[0].path, {})}
      };
    } else {
      return null;
    }
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
