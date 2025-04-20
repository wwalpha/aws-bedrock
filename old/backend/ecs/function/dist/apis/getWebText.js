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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_html_parser_1 = require("node-html-parser");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
exports.default = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.query['url'];
    if (!url) {
        return { message: 'url is missing' };
    }
    const res = yield fetch(url);
    const html = yield res.text();
    // 不正なタグなどを補完
    const cleanHtml = (0, sanitize_html_1.default)(html, {
        // body と html がデフォルトで消えるため、それを防止するオプション
        allowedTags: [...sanitize_html_1.default.defaults.allowedTags, 'body', 'html'],
    });
    const root = (0, node_html_parser_1.parse)(cleanHtml, {
        comment: false,
        blockTextElements: {
            script: false,
            noScript: false,
            style: false,
            pre: false,
        },
    });
    // @ts-ignore
    const text = root.querySelector('body').removeWhitespace().text;
    return {
        text,
    };
});
