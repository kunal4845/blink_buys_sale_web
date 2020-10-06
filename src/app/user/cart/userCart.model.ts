import { Product } from '../../admin/products/product.model';

export class UserCart {
    id: number;
    userId: number;
    productId: number;
    isDeleted: boolean;
    quantity: number;
    product: Product;
    constructor() {
        this.id = 0;
        this.userId = 0;
        this.productId = 0;
        this.isDeleted = false;
        this.quantity = 0;
        this.product = new Product();
    }
}
