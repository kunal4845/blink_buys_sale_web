export class ServiceProviderAvailability {
    id: number;
    serviceProviderId: number;
    timings: string;
    days: string;
    isActive: boolean;
    isDeleted: boolean;
    createdDt: Date;
    modifiedDt: Date;

    constructor() {
        this.id = 0;
        this.serviceProviderId = 0;
        this.timings = '';
        this.days = '';
        this.isActive = false;
        this.isDeleted = false;
        this.createdDt = new Date();
        this.modifiedDt = new Date();
    }
}
