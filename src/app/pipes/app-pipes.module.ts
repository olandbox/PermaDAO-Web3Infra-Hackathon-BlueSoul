import { NgModule } from '@angular/core';

import { IsFinitePipe } from "./isFinit.pipe";
import { TimeSincePipe } from './time.pipe';
import { EllipsisAddressPipe } from './ellipsisAddress.pipe';
import { SafeHtmlPipe } from './sanitizeHtml.pipe';

@NgModule({
    imports: [
      // dep modules
    ],
    declarations: [ 
        IsFinitePipe,
        TimeSincePipe,
        EllipsisAddressPipe,
        SafeHtmlPipe
    ],
    exports: [
        IsFinitePipe,
        TimeSincePipe,
        EllipsisAddressPipe,
        SafeHtmlPipe
    ]
  })
  export class AppPipesModule {}