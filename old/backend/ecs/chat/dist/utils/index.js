"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.DataNotfoundError = exports.ValidationError = exports.Logger = exports.DBHelper = void 0;
var dbHelper_1 = require("./dbHelper");
Object.defineProperty(exports, "DBHelper", { enumerable: true, get: function () { return __importDefault(dbHelper_1).default; } });
var logger_1 = require("./logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return __importDefault(logger_1).default; } });
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class DataNotfoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DataNotfoundError';
    }
}
exports.DataNotfoundError = DataNotfoundError;
class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ForbiddenError';
    }
}
exports.ForbiddenError = ForbiddenError;
