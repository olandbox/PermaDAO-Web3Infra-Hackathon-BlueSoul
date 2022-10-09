import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sucess-modal',
  template: `
  <div class="modal-header">
    <p class="modal-title fw-bold fs-1">{{ title }}</p>
  </div>
  <div class="modal-body fs-5 text-break" [innerHtml]="message">

  </div>
  <div class="modal-footer ">
    <button type="button" class="btn btn-lg btn-outline-secondary mr-3" (click)="close()">continue minting</button>
    <button type="button" class="btn btn-lg btn-primary" (click)="goLands()">check your land {{second}}</button>
  </div>
  `
})
export class SucessModalComponent {

  @Input() title = 'MINTED';
  @Input() message = `
    <p>Congratulations! </p>
    <p>Your have minted your oland successfully.</p>
    <p>And you can own it permanently.</p>
  `;

  timer: any;
  second: number = 5;
  constructor(public activeModal: NgbActiveModal, private router: Router) { }

  ngOnInit(): void {
    this.timer = setInterval(() => {
      if (this.second > 0) {
        --this.second;
      } else {
        this.goLands();
      }
    }, 1000)
  }
  ngOnDestory(): void {
    clearInterval(this.timer)
  }

  close() {
    clearInterval(this.timer)
    this.activeModal.close('Close click');
  }

  goLands() {
    clearInterval(this.timer);
    this.activeModal.close('Close click');
    this.router.navigate(['oland/r', 'land']);
  }

}
