export class SubCategoryModel {
    id: number;
    serviceId: number;
    subCategoryName: string;
    description: string;
    isActive: boolean;
    isDeleted: boolean;
    createdDt: Date;

    constructor() {
        this.id = 0;
        this.serviceId = 0;
        this.subCategoryName = '';
        this.description = '';
        this.isActive = false;
        this.isDeleted = false;
        this.createdDt = new Date();
    }
}