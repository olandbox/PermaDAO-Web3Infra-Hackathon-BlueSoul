import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'isFinite'})
export class IsFinitePipe implements PipeTransform {
    transform(value: number): number | string {
        return Number.isFinite(value) ? value : '--'
    }
}