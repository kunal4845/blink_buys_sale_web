import { User } from 'src/app/login/login.interface';
import { PaymentModel } from 'src/app/user/cart/payment/payment.model';
import { BillingAddress } from 'src/app/user/checkout/billingAddress.model';
import { Product } from '../product.model';

export class BookedProductModel {
    bookedProductId: number;
    productId: number;
    billingAddressId: number;
    paymentId: number;
    userId: number;
    quantity: number;
    type: string;
    isDeleted: boolean;
    isRejectedByAdmin: boolean;
    isApprovedByAdmin: boolean;
    isRejectedByDealer: boolean;
    isApprovedByDealer: boolean;
    isCancelledByUser: boolean;
    deliveryStatus: string;
    paymentMode: string;
    createdDt: Date;
    createdBy: number;
    modifiedDt: Date;
    modifiedBy: number;
    product: Product;
    billingAddress: BillingAddress;
    payment: PaymentModel;
    user: User;

    constructor() {
        this.product = new Product();
        this.billingAddress = new BillingAddress();
        this.payment = new PaymentModel();
        this.user = new User();
        
        this.bookedProductId = 0;
        this.productId = 0;
        this.billingAddressId = 0;
        this.paymentId = 0;
        this.userId = 0;
        this.quantity = 0;
        this.type = '';
        this.isDeleted = false
        this.isRejectedByAdmin = false;
        this.isApprovedByAdmin = false;
        this.isRejectedByDealer = false;
        this.isApprovedByDealer = false;
        this.isCancelledByUser = false;
        this.deliveryStatus = '';
        this.paymentMode = '';
        this.createdDt = new Date();
        this.createdBy = 0;
        this.modifiedDt = new Date();
        this.modifiedBy = 0;
    }
}