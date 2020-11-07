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


export class BookedServiceModel {
    bookedServiceId: number;
    serviceProviderId: number;
    serviceId: number;
    userId: number;
    isActive: boolean;
    isDeleted: boolean;
    createdDt: Date;
    cityId: number;
    isRejectedByAdmin: boolean;
    isApprovedByAdmin: boolean;
    isRejectedByServiceProvider: boolean;
    isApprovedByServiceProvider: boolean;
    isCancelledByUser: boolean;

    constructor() {
        this.bookedServiceId = 0;
        this.serviceProviderId = 0;
        this.serviceId = 0;
        this.userId = 0;
        this.isActive = false;
        this.isDeleted = false;
        this.createdDt = new Date();
        this.cityId = 0;
        this.isApprovedByAdmin = false;
        this.isApprovedByServiceProvider = false;
        this.isCancelledByUser = false;
        this.isRejectedByAdmin = false;
        this.isRejectedByServiceProvider = false;
    }
}
