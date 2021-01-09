"use strict";
exports.__esModule = true;
exports.CommissionPercentage = exports.MOBILE_NO_PATTERN = exports.EMAIL_PATTERN = exports.PASSWORD_PATTERN = exports.ALPHA_ONLY_PATTERN = exports.NUM_ONLY_PATTERN = exports.NUM_WITH_DECI_PATTERN = exports.RESTRICT_PRECEDING_SPACE = exports.DIGIT_ONLY = exports.ClientId = exports.APIURL = exports.SiteUrl = exports.paypalClientId = exports.paypalSecretKey = exports.secret = exports.SiteKey = exports.CartType = exports.roleType = void 0;
var roleType;
(function (roleType) {
    roleType[roleType["Admin"] = 1] = "Admin";
    roleType[roleType["Dealer"] = 2] = "Dealer";
    roleType[roleType["User"] = 3] = "User";
    roleType[roleType["ServiceProvider"] = 4] = "ServiceProvider";
})(roleType = exports.roleType || (exports.roleType = {}));
var CartType;
(function (CartType) {
    CartType["Product"] = "product";
    CartType["Service"] = "service";
})(CartType = exports.CartType || (exports.CartType = {}));
exports.SiteKey = "6LcA88IZAAAAAJmEeYL81Qx2Pc9yuozXIf2TyfVd";
exports.secret = "6LcA88IZAAAAAAkXbG3yx4TSeKqje3j4WqPIk6nc";
exports.paypalSecretKey = "EHCY0AdTOSxCckOYb3_R5xszDdk61jXFuG2I4X3JvtuHsACUmYoxwY-WK9LOahfKqF19rhf8qDhVl_W8";
exports.paypalClientId = "ARFQJFtPLb7bdmXfGNOKystrrn97293_Qot8aMXu-aXp8AX3ZQkZ4xWw0GpTe1c5ZddtsLjHEbYeY20J";
// local
// export const LocalHost = "http://localhost:4200/";
exports.SiteUrl = "http://blinknbuys.com/";
// export const APIURL = "https://localhost:44378/api/";
exports.APIURL = "https://blinkandbuysapi.azurewebsites.net/api/";
exports.ClientId = "ASJype4AiuDfJ47dL8VfjoQbvQF1JMMrHeiNJi18Px7ClFjLHbMblc3V7u1lx3qozRJpp7FRc-5_xFtV";
exports.DIGIT_ONLY = "^(0|[1-9][0-9]*)$";
exports.RESTRICT_PRECEDING_SPACE = ".*[^ ].*";
exports.NUM_WITH_DECI_PATTERN = /^\d+(\.\d{1,2})?$/;
exports.NUM_ONLY_PATTERN = /^\d+$/;
exports.ALPHA_ONLY_PATTERN = /^[A-Za-z]+/;
exports.PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/;
exports.EMAIL_PATTERN = /\S+@\S+\.\S+/;
exports.MOBILE_NO_PATTERN = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
exports.CommissionPercentage = 10;
