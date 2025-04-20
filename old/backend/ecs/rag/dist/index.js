"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _utils_1 = require("./utils/index");
const app_1 = __importDefault(require("./app"));
const server = app_1.default.listen(process.env['EXPOSE_PORT'] || 8080, () => {
    _utils_1.Logger.info('Started...');
    _utils_1.Logger.info('Port: ', process.env['EXPOSE_PORT'] || 8080);
    console.log('started...');
});
// timeout 20s
server.timeout = 1000 * 20;
