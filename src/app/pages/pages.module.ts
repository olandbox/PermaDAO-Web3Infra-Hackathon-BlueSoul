import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



// Routing
import { PagesRoutingModule } from './pages-routing.module';
import { AppPipesModule } from "../pipes/app-pipes.module";
import { DirectivesModule } from '../directives/directives.module';

// other module
import { AppBootstrapModule } from "../app-bootstrap.module";
import { MaterialModule } from '../material-module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareButtonsPopupModule } from 'ngx-sharebuttons/popup';
import { ShareIconsModule } from 'ngx-sharebuttons/icons'
import { FontAwesomeModule, FaIconLibrary  } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { CdTimerModule } from 'angular-cd-timer';

// Components
import { TopBarComponent } from './top-bar/top-bar.component';
import { HomeComponent } from "./home/home.component";
import { ErrorComponent } from './error/error.component';
import { AboutComponent } from './about/about.component';
import { LoginBoardComponent } from './home/login-board/login-board.component';
import { LogoutBoardComponent } from './home/logout-board/logout-board.component';
import { FailModalComponent } from './components/fail-modal/fail-modal.component';
import { SucessModalComponent } from "./components/sucess-modal/sucess-modal.component";

import { MerkletreeComponent } from './tool-pages/merkletree/merkletree.component';
import { LoadingComponent } from '../pages/components/loading/loading.component';
import { UserComponent } from './user/user.component';
import { CardsComponent } from './home/cards/cards.component';
import { DetailComponent } from './detail/detail.component';
import { MintHistoryComponent } from './components/mint-history/mint-history.component';
import { HistoryComponent } from './history/history.component';
import { ThumbComponent } from './lands/thumb/thumb.component';
import { IntroComponent } from './lands/intro/intro.component';
import { CommunityComponent } from './lands/community/community.component';
import { EditorComponent } from './lands/editor/editor.component';
import { LandsComponent } from './lands/lands.component';
import { LandsEditComponent } from './lands/lands-edit.component';
import { MappingComponent } from './lands/mapping/mapping.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { CopyLinkModalComponent } from './components/copy-link/copy-link.component';
import { MintedComponent } from './home/minted/minted.component';
import { SearchTipComponent } from './home/search-tip/search-tip.component';
import { LandsFooterComponent, AddDialog, ShareDialog } from './lands/lands-footer/lands-footer.component';
import { LanguageDialog } from './lands/language-dialog';
import { DeleteDialog } from './components/deleteDialog/delete-dialog';
import { LandsSimpleComponent } from './lands/lands-simple.component';
import { ThumbSimpleComponent } from './lands/thumb-simple/thumb-simple.component';
import { VerifyFailComponent } from './home/verify-fail/verify-fail.component';
import { NotOpenComponent } from './home/not-open/not-open.component';
import { NotMintComponent } from './home/not-mint/not-mint.component';
import { UploadDialog } from './components/upload-dialog/upload-dialog';
import { ZoomDialog } from './components/zoom-dialog/zoom-dialog';
import { LinkDialog } from "./lands/dialogs/link-dialog/link-dialog";
import { ChainDialog } from './lands/dialogs/chain-dialog/chain-dialog';
import { EventDialog } from './lands/dialogs/event-dialog/event-dialog';
import { DateRangeDialog } from './lands/dialogs/date-range-dialog/date-range-dialog';
import { OlandComponent } from './layout/oland/oland.component';
import { LinkUrlComponent } from './lands/community/link-items/link-url/link-url.component';
import { LinkImageComponent } from './lands/community/link-items/link-image/link-image.component';
import { LinkTextComponent } from './lands/community/link-items/link-text/link-text.component';
import { LinkWeb3Component } from './lands/community/link-items/link-web3/link-web3.component';
import { LinkTextEditComponent } from './lands/community/link-items/link-text-edit/link-text-edit.component';
import { LinkUrlEditComponent } from './lands/community/link-items/link-url-edit/link-url-edit.component';
import { LinkImageEditComponent } from './lands/community/link-items/link-image-edit/link-image-edit.component';
import { LinkWeb3EditComponent } from './lands/community/link-items/link-web3-edit/link-web3-edit.component';
import { LinkEventComponent } from './lands/community/link-items/link-event/link-event.component';
import { LinkEventEditComponent } from './lands/community/link-items/link-event-edit/link-event-edit.component';



@NgModule({
  declarations: [
    TopBarComponent,
    HomeComponent,
    ErrorComponent,
    AboutComponent,
    LoginBoardComponent,
    LogoutBoardComponent,
    FailModalComponent,
    SucessModalComponent,
    MerkletreeComponent,
    LoadingComponent,
    UserComponent,
    CardsComponent,
    DetailComponent,
    MintHistoryComponent,
    HistoryComponent,
    ThumbComponent,
    IntroComponent,
    CommunityComponent,
    EditorComponent,
    LandsComponent,
    LandsEditComponent,
    LandsSimpleComponent,
    MappingComponent,
    ConfirmModalComponent,
    UploadImageComponent,
    CopyLinkModalComponent,
    MintedComponent,
    SearchTipComponent,
    LanguageDialog,
    DeleteDialog,
    UploadDialog,
    ZoomDialog,
    LandsFooterComponent,AddDialog,ShareDialog,
    ThumbSimpleComponent,
    VerifyFailComponent,
    NotOpenComponent,
    NotMintComponent,
    ChainDialog,
    EventDialog,
    DateRangeDialog,
    LinkDialog,
    OlandComponent,
    LinkUrlComponent,
    LinkImageComponent,
    LinkTextComponent,
    LinkWeb3Component,
    LinkTextEditComponent,
    LinkUrlEditComponent,
    LinkImageEditComponent,
    LinkWeb3EditComponent,
    LinkEventComponent,
    LinkEventEditComponent,
  ],
  imports: [
    IonicModule.forRoot({}),
    CommonModule,
    AppBootstrapModule,
    MaterialModule,
    FormsModule,
    PagesRoutingModule,
    AppPipesModule,
    NgbModule,
    NgxSkeletonLoaderModule,
    DirectivesModule,
    ShareButtonsModule,
    ShareButtonsPopupModule,
    ShareIconsModule,
    FontAwesomeModule,
    CdTimerModule
  ],
  exports: [
    TopBarComponent,
    HomeComponent
  ],
  providers: []
})
export class PagesModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIconPacks(far);
  }
}
