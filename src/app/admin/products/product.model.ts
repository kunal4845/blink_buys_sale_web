export class Product {
    id: number;
    productTitle: string;
    productName: string;
    description: string;
    note: string;
    specification: string;
    price: number;
    size: string;
    isActive: boolean;
    isDeleted: boolean;
    createdDt: Date;
    masterImage: string;
    productImages: ProductImage[] = [];
    productCategoryId: number;
    isVerified: boolean;

    constructor() {
        this.id = 0;
        this.productTitle = '';
        this.productName = '';
        this.description = '';
        this.note = '';
        this.specification = '';
        this.price = 0;
        this.size = '';
        this.isActive = false;
        this.isDeleted = false;
        this.createdDt = new Date();
        this.masterImage = '';
        this.productImages = [];
        this.productCategoryId = 0;
        this.isVerified = false;
    }
}

export class ProductImage {
    name: string;
    path: string;
    type: string
    productId: number;
    isPrimaryImage: boolean;
    lastModified: number;
    lastModifiedDate: Date;
    size: number;

    constructor() {
        this.name = '';
        this.path = '';
        this.type = '';
        this.productId = 0;
        this.isPrimaryImage = false;
        this.lastModified = null;
        this.lastModifiedDate = new Date();
        this.size = null;
    }
}



