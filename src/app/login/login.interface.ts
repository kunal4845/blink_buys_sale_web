export class User {
    id: number;
    roleId?: number;
    name: string;
    email: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
    token?: string;
    companyName: string;
    contactNumber: string;
    //
    address: string;
    streetAddress: string;
    zipCode: string;
    productCategoryId: string;
    isGstAvailable: string;
    gstNumber: string;
    accountNumber: string;
    accountHolderName: string;
    ifscCode: string;
    isNumberVerified: boolean;
    isActive: boolean;
    isAccountVerified: boolean;
    idProofPath: string;
    cancelledChequePath: string;
    //
    createdDt: Date;
    isDeleted: boolean;
    //
    cityId: number;
    stateId: number;
    fatherName: string;
    gender: string;
    qualification: string;
    serviceId: number;
    serviceSubCategoryId: number;

    constructor() {
        this.id = 0;
        this.roleId = null;
        this.name = "";
        this.email = "";
        this.password = "";
        this.token = "";
        this.confirmPassword = "";
        this.newPassword = "";
        this.companyName = "";
        this.contactNumber = '';
        this.createdDt = null;
        this.address = '';
        this.streetAddress = '';
        this.zipCode = '';
        this.productCategoryId = '0';
        this.isGstAvailable = '';
        this.gstNumber = '';
        this.accountNumber = '';
        this.accountHolderName = '';
        this.ifscCode = '';
        this.cityId = 0;
        this.stateId = 0;
        this.fatherName = '';
        this.gender = '';
        this.qualification = '';
        this.serviceId = 0;
        this.serviceSubCategoryId = 0;
    }
}
