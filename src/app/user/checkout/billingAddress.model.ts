import { ThrowStmt } from '@angular/compiler';

export class BillingAddress {
    id: number;
    //
    fullName: string;
    mobile: string;
    landMark: string;
    city: string;
    state: string;
    address: string;
    zipCode: string;
    //
    createdDt: Date;
    isDeleted: boolean;
    //
    constructor() {
        this.id = 0;
        this.createdDt = new Date();
        this.address = '';
        this.fullName = '';
        this.zipCode = '';
        this.mobile = '';
        this.landMark = '';
        this.city = '';
        this.state = '';
        this.isDeleted = false;
    }
}
