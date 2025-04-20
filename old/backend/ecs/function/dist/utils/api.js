"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bedrockApi_1 = __importDefault(require("./bedrockApi"));
const bedrockAgentApi_1 = __importDefault(require("./bedrockAgentApi"));
const sagemakerApi_1 = __importDefault(require("./sagemakerApi"));
const api = {
    bedrock: bedrockApi_1.default,
    //@ts-ignore
    bedrockAgent: bedrockAgentApi_1.default,
    sagemaker: sagemakerApi_1.default,
};
exports.default = api;
