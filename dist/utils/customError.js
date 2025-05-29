"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}
exports.CustomError = CustomError;
