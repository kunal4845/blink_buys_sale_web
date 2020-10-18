export class CategoryModel {
    id: number;
    categoryName: string;
    description: string;
    isActive: boolean;
    isDeleted: boolean;
    createdDt: Date;

    constructor() {
        this.id = 0;
        this.categoryName = '';
        this.description = '';
        this.isActive = false;
        this.isDeleted = false;
        this.createdDt = new Date();
    }
}