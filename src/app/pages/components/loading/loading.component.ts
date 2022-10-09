import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-loading',
    template: `
        <div *ngIf="isLoading" class="d-flex justify-content-center py-5">
            <div class="spinner-border text-primary" style="width: 5rem; height: 5rem;" role="status">
                <span class="visually-hidden"></span>
            </div>
        </div>
    `
})
export class LoadingComponent {
    @Input() isLoading: boolean = false;

    constructor() {}
}