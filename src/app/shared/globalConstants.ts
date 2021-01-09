export enum roleType {
    Admin = 1,
    Dealer = 2,
    User = 3,
    ServiceProvider = 4
}

export enum CartType {
    Product = 'product',
    Service = 'service'
}

export const SiteKey = "6LcA88IZAAAAAJmEeYL81Qx2Pc9yuozXIf2TyfVd";
export const secret = "6LcA88IZAAAAAAkXbG3yx4TSeKqje3j4WqPIk6nc";

export const paypalSecretKey = "EHCY0AdTOSxCckOYb3_R5xszDdk61jXFuG2I4X3JvtuHsACUmYoxwY-WK9LOahfKqF19rhf8qDhVl_W8";
export const paypalClientId = "ARFQJFtPLb7bdmXfGNOKystrrn97293_Qot8aMXu-aXp8AX3ZQkZ4xWw0GpTe1c5ZddtsLjHEbYeY20J";

// local
// export const LocalHost = "http://localhost:4200/";
export const SiteUrl = "http://blinknbuys.com/";

// export const APIURL = "https://localhost:44378/api/";
export const APIURL = "https://blinkandbuysapi.azurewebsites.net/api/";

export const ClientId =
    "ASJype4AiuDfJ47dL8VfjoQbvQF1JMMrHeiNJi18Px7ClFjLHbMblc3V7u1lx3qozRJpp7FRc-5_xFtV";

export const DIGIT_ONLY = "^(0|[1-9][0-9]*)$";
export const RESTRICT_PRECEDING_SPACE = ".*[^ ].*";
export const NUM_WITH_DECI_PATTERN = /^\d+(\.\d{1,2})?$/;
export const NUM_ONLY_PATTERN = /^\d+$/;
export const ALPHA_ONLY_PATTERN = /^[A-Za-z]+/;
export const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/;
export const EMAIL_PATTERN = /\S+@\S+\.\S+/;
export const MOBILE_NO_PATTERN = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

export const CommissionPercentage = 10;