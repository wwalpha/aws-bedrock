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
const _utils_1 = require("../utils/index");
exports.default = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { chat, id, prompt } = req.body;
    // model.type が bedrockAgent の場合は title が生成できないため bedrock のデフォルトモデルを使う
    const model = req.body.model.type === 'bedrockAgent' ? _utils_1.defaultModel : req.body.model || _utils_1.defaultModel;
    // タイトル設定用の質問を追加
    const messages = [
        {
            role: 'user',
            content: prompt,
        },
    ];
    // 新規モデル追加時は、デフォルトで Claude の prompter が利用されるため
    // 出力が <output></output> で囲まれる可能性がある
    // 以下の処理ではそれに対応するため、<output></output> を含む xml タグを削除している
    const title = (_d = (_c = (yield ((_b = (_a = _utils_1.API[model.type]).invoke) === null || _b === void 0 ? void 0 : _b.call(_a, model, messages, id)))) === null || _c === void 0 ? void 0 : _c.replace(/<([^>]+)>([\s\S]*?)<\/\1>/, '$2')) !== null && _d !== void 0 ? _d : '';
    // TODO: タイトルを更新する場合は以下の処理を追加する
    // await setChatTitle(chat.id, chat.createdDate, title);
    return title;
});
