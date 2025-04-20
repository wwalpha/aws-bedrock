"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _utils_1 = require("./utils/index");
exports.default = (req, res, callback) => __awaiter(void 0, void 0, void 0, function* () {
    // イベントログ;
    try {
        // 認証
        // await validate(event);
        // 本処理
        const result = yield callback(req);
        // 本処理結果
        _utils_1.Logger.info(result);
        res.status(200).send(result);
    }
    catch (error) {
        // エラーログ
        _utils_1.Logger.error('Error', error);
        if (error.name === 'ValidationError') {
            const vError = error;
            res.status(400).send(vError.message);
        }
        else if (error.name === 'ForbiddenError') {
            const vError = error;
            res.status(403).send(vError.message);
        }
        else {
            res.status(500).send(error.message);
        }
    }
});
