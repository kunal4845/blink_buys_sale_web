export class ContactUsModel {
    id: number;
    name: string;
    email: string;
    message: string;

    isActive: boolean;
    isDeleted: boolean;
    createdDt: Date;

    constructor() {
        this.id = 0;
        this.name = '';
        this.email = '';
        this.message = '';
        this.isActive = false;
        this.isDeleted = false;
        this.createdDt = new Date();
    }
}