"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const entry_1 = __importDefault(require("./entry"));
const queryKendra_1 = __importDefault(require("./apis/queryKendra"));
const retrieveKendra_1 = __importDefault(require("./apis/retrieveKendra"));
const app = (0, express_1.default)();
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.disable('x-powered-by');
app.options('*', (_, res) => res.sendStatus(200));
// health check
app.get('/rag/health', (_, res) => res.send('backend'));
app.post('/rag/query', express_1.default.json(), (req, res) => (0, entry_1.default)(req, res, queryKendra_1.default));
app.post('/rag/retrieve', express_1.default.json(), (req, res) => (0, entry_1.default)(req, res, retrieveKendra_1.default));
exports.default = app;
