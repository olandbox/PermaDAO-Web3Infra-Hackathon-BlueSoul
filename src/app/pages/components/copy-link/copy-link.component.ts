import { Component, Input } from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-copy-link-modal',
  styleUrls: ['copy-link.component.less'],
  template: `
  <div class="modal-header">
    <p class="modal-title fw-bold fs-1">Share your profile</p>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="activeModal.close('Close click')">
        <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body fs-5 text-break">
   <div class="share"></div>
   <button class="btn btn-link" (click)="copy()">COPY</button>
  </div>

  `
})
export class CopyLinkModalComponent {

  
  constructor(public activeModal: NgbActiveModal, private clipboard: Clipboard) { }

  ngOnInit(): void {
  }

  copy() {
    this.clipboard.copy(decodeURI(window.location.href));
  }

}
