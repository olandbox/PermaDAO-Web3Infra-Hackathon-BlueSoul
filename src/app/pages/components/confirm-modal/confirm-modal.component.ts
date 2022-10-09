import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  template: `
  <div class="modal-header">
    <p class="modal-title fw-bold fs-1">{{ title }}</p>
  </div>
  <div class="modal-body fs-5 text-break">
    {{ message }}
  </div>
  <div class="modal-footer ">
    <button type="button" class="btn btn-lg btn-light" (click)="activeModal.close('Close click')">Cancel</button>
    <button type="button" class="btn btn-lg btn-primary" (click)="delete()">Delete</button>
  </div>
  `
})
export class ConfirmModalComponent implements OnInit {

  @Input() title = 'Delete';
  @Input() message = "Are you sure you want to delete it?";

  @Output() deleteEvent = new EventEmitter<boolean>();

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  delete() {
    this.deleteEvent.emit(true);
    this.activeModal.close('Close click')
  }

}
