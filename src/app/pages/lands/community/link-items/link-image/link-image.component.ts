import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZoomDialog } from 'src/app/pages/components/zoom-dialog/zoom-dialog';

import { CommunityActionService } from '../../community-action.service';
import { Link } from '../../community.model';

@Component({
  selector: 'app-link-image',
  templateUrl: './link-image.component.html',
  styleUrls: ['../../community.component.less']
})
export class LinkImageComponent implements OnInit {
  @Input() link: Link;

  constructor(
    public communityActionService: CommunityActionService,
    public matDialog: MatDialog,
    ) { }

  ngOnInit(): void {
  }

  viewImage(url: string) {
    if (!url) return;
    this.matDialog.open(ZoomDialog, {
      panelClass: 'lands-zoom-dialog',
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      data: {url: url}
    })
  }
}

