"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kendra = void 0;
const client_kendra_1 = require("@aws-sdk/client-kendra");
let kendraClient;
/** Kendra Client初期化 */
const kendra = (options) => {
    // 初期化済み
    if (kendraClient)
        return kendraClient;
    // 初期化設定あり
    if (options)
        return new client_kendra_1.KendraClient(options);
    kendraClient = new client_kendra_1.KendraClient({});
    return kendraClient;
};
exports.kendra = kendra;
