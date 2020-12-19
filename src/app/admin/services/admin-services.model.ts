import { User } from 'src/app/login/login.interface';
import { PaymentModel } from 'src/app/user/cart/payment/payment.model';
import { BillingAddress } from 'src/app/user/checkout/billingAddress.model';

export class ServiceModel {
    id: number;
    serviceName: string;
    description: string;
    isActive: boolean;
    isDeleted: boolean;
    createdDt: Date;
    serviceIcon: string;
    price: number;

    constructor() {
        this.id = 0;
        this.serviceName = ''; this.serviceIcon = '';
        this.description = '';
        this.isActive = false;
        this.isDeleted = false;
        this.createdDt = new Date();
        this.price = 0;
    }
}


export class BookedServiceModel {
    bookedServiceId: number;
    serviceProviderId: number;
    serviceId: number;
    userId: number;
    paymentId: number;
    billingAddressId: number;
    deliveryStatus: string;
    paymentMode: string;
    type: string;
    quantity: number;
    isActive: boolean;
    isDeleted: boolean;
    createdDt: Date;
    isRejectedByAdmin: boolean;
    isApprovedByAdmin: boolean;
    isRejectedByServiceProvider: boolean;
    isApprovedByServiceProvider: boolean;
    isCancelledByUser: boolean;
    
    service: ServiceModel;
    billingAddress: BillingAddress;
    payment: PaymentModel;
    user: User;

    constructor() {
        this.bookedServiceId = 0;
        this.serviceProviderId = 0;
        this.serviceId = 0;
        this.userId = 0;
        this.isActive = false;
        this.isDeleted = false;
        this.createdDt = new Date();
        this.paymentId = 0;
        this.billingAddressId = 0;
        this.deliveryStatus = '';
        this.paymentMode = '';
        this.type = '';
        this.quantity = 0;

        this.isApprovedByAdmin = false;
        this.isApprovedByServiceProvider = false;
        this.isCancelledByUser = false;
        this.isRejectedByAdmin = false;
        this.isRejectedByServiceProvider = false;

        this.service = new ServiceModel();
        this.billingAddress = new BillingAddress();
        this.payment = new PaymentModel();
        this.user = new User();
    }
}
