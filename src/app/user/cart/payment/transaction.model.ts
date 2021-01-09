export class TransactionModel {
    id: string;
    create_time: string;
    status: string;
    payer_email: string;
    payer_id: string;
    payer_name: string;
    amount: string;
    payee_email: string;
    merchant_id: string;

    constructor() {
        this.id = '';
        this.create_time = '';
        this.status = '';
        this.payer_email = '';
        this.payer_id = '';
        this.payer_name = '';
        this.amount = '';
        this.payee_email = '';
        this.merchant_id = '';

    }
}

