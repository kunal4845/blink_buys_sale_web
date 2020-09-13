export class Product {
    id: number;
    productTitle: string;
    productName: string;
    shortDescription: string;
    longDescription: string;
    note: string;
    currency: string;
    unit: string;
    noOfProducts: number;
    isSpecialDeal: boolean;
    isSpecialOffer: boolean;
    productCategoryId: number;
    productSubCategoryId: number;
    foodCategoryId: number;
    cuisineId: number;
    isReturnable: boolean;
    isActive: boolean;
    createdDt: Date;
    masterImage: string;
    productQuantities: ProductQuantity[] = [];
    productImages: ProductImage[] = [];

    constructor() {
        this.id = 0;
        this.productTitle = '';
        this.productName = '';
        this.shortDescription = '';
        this.longDescription = '';
        this.note = '';
        this.currency = '';
        this.unit = '';
        this.noOfProducts = 0;
        this.isSpecialDeal = false;
        this.isSpecialOffer = false;
        this.productCategoryId = 0;
        this.productSubCategoryId = 0;
        this.foodCategoryId = 0;
        this.cuisineId = 0;
        this.isReturnable = false;
        this.isActive = false;
        this.createdDt = new Date();
        this.masterImage = '';
        this.productQuantities = [];
        this.productImages = [];
    }
}

export class ProductQuantity {
    id: number;
    quantity: number;
    discount: number;
    oldPrice: number;
    newPrice: number;
    isFreeDelivery: boolean;
    isAvailable: boolean;
    productId: number;

    constructor() {
        this.id = 0;
        this.quantity = null;
        this.discount = 0;
        this.oldPrice = null;
        this.newPrice = null;
        this.isFreeDelivery = false;
        this.isAvailable = false;
        this.productId = 0;
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



