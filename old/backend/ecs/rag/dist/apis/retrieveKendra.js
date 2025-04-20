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
const client_kendra_1 = require("@aws-sdk/client-kendra");
const _utils_1 = require("../utils/index");
const _consts_1 = require("../consts/index");
exports.default = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.body;
    // デフォルト言語が英語なので、言語設定は必ず行う
    const attributeFilter = {
        AndAllFilters: [
            {
                EqualsTo: {
                    Key: '_language_code',
                    Value: {
                        StringValue: 'ja',
                    },
                },
            },
        ],
    };
    const command = new client_kendra_1.RetrieveCommand({
        IndexId: _consts_1.ENVs.KENDRA_INDEX_ID,
        QueryText: query,
        AttributeFilter: attributeFilter,
    });
    const res = yield _utils_1.ClientHelper.kendra().send(command);
    return res;
});
