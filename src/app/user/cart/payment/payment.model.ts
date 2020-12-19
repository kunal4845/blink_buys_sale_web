export class PaymentModel {
    id: number;
    userId: number;
    paymentType: string;
    paymentStatus: string;
    transactionNumber: string;
    amount: number;
    transactionDate: Date;
    createdDt: Date;
    createdBy: number;

    constructor() {
        this.id = 0;
        this.userId = 0;
        this.paymentType = '';
        this.paymentStatus = '';
        this.transactionNumber = '';
        this.amount = 0;
        this.transactionDate = new Date();
        this.createdDt = new Date();
        this.createdBy = 0;
    }
}
