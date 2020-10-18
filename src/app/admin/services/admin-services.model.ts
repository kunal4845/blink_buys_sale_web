export class ServiceModel {
    id: number;
    serviceName: string;
    description: string;

    isActive: boolean;
    isDeleted: boolean;
    createdDt: Date;
    serviceIcon: string;

    constructor() {
        this.id = 0;
        this.serviceName = ''; this.serviceIcon = '';
        this.description = '';
        this.isActive = false;
        this.isDeleted = false;
        this.createdDt = new Date();
    }
}
