import { ServiceModel } from '../../admin/services/admin-services.model';
import { Product } from '../../admin/products/product.model';

export class UserCart {
    id: number;
    userId: number;
    bookedItemId: number;
    isDeleted: boolean;
    quantity: number;
    product: Product;
    service: ServiceModel;
    type: string;
    constructor() {
        this.id = 0;
        this.userId = 0;
        this.bookedItemId = 0;
        this.isDeleted = false;
        this.quantity = 0;
        this.product = new Product();
        this.service = new ServiceModel();
        this.type = '';
    }
}
