import { Component, Input } from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fail-modal',
  template: `
  <div class="modal-header">
    <p class="modal-title fw-bold fs-1 font-second">{{ title }}</p>
  </div>
  <div class="modal-body fs-5 text-break text-white">
    <p class="text-center">{{ message }}</p>
    <p class="text-center bg-gray py-2 text-truncate font-second"><a class="font-second" href="{{ link }}">{{ link }}</a></p>
  </div>
  <div class="modal-footer ">
    <button type="button" class="btn btn-lg btn-primary" (click)="activeModal.close('Close click')">Close</button>
  </div>
  `
})
export class FailModalComponent {

  @Input() title = 'FAILED MINT';
  @Input() message = 'Sorry, the operation failed.  Please click the link below to view details.';
  @Input() tx = '';

  link = '';
  constructor(public activeModal: NgbActiveModal) {

   }

  ngOnInit(): void {
    this.link = `${environment.polygonscanURI}${this.tx}`;
  }

}