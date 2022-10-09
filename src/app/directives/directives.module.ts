import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AutoFocusDirective } from "./autofocus.directive";
import { StylePaginatorDirective } from "./style-paginator.directive";

@NgModule({
  declarations: [AutoFocusDirective, StylePaginatorDirective],
  imports: [CommonModule],
  exports: [AutoFocusDirective, StylePaginatorDirective]
})
export class DirectivesModule {}