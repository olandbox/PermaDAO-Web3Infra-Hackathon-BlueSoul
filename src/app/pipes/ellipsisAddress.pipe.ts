import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'ellipsisAddress'})
export class EllipsisAddressPipe implements PipeTransform {
    transform(address: string): string {
        if (address.length > 8) {
            return address.slice(0,4) + '...' + address.slice(-4)
          } else {
            return address
          }
    }
}