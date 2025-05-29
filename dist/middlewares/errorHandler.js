"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const customError_1 = require("../utils/customError");
const errorHandler = (err, req, res, next) => {
    if (err instanceof customError_1.CustomError) {
        res.status(err.status).json({ message: err.message });
        return;
    }
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
};
exports.errorHandler = errorHandler;
