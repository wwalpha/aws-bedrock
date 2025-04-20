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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
const models_1 = require("./models");
const client_sts_1 = require("@aws-sdk/client-sts");
const streamingChunk_1 = require("./streamingChunk");
// STSから一時的な認証情報を取得する関数
const assumeRole = (crossAccountBedrockRoleArn) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const stsClient = new client_sts_1.STSClient({ region: process.env.MODEL_REGION });
    const command = new client_sts_1.AssumeRoleCommand({
        RoleArn: crossAccountBedrockRoleArn,
        RoleSessionName: 'BedrockApiAccess',
    });
    try {
        const response = yield stsClient.send(command);
        if (response.Credentials) {
            return {
                accessKeyId: (_a = response.Credentials) === null || _a === void 0 ? void 0 : _a.AccessKeyId,
                secretAccessKey: (_b = response.Credentials) === null || _b === void 0 ? void 0 : _b.SecretAccessKey,
                sessionToken: (_c = response.Credentials) === null || _c === void 0 ? void 0 : _c.SessionToken,
            };
        }
        else {
            throw new Error('認証情報を取得できませんでした。');
        }
    }
    catch (error) {
        console.error('Error assuming role: ', error);
        throw error;
    }
});
// BedrockRuntimeClient を初期化するこの関数は、通常では単純に BedrockRuntimeClient を環境変数で指定されたリージョンで初期化します。
// 特別なケースとして、異なる AWS アカウントに存在する Bedrock リソースを利用したい場合があります。
// そのような場合、CROSS_ACCOUNT_BEDROCK_ROLE_ARN 環境変数が設定されているかをチェックします。(cdk.json で crossAccountBedrockRoleArn が設定されている場合に環境変数として設定される)
// 設定されている場合、指定されたロールを AssumeRole 操作によって引き受け、取得した一時的な認証情報を用いて BedrockRuntimeClient を初期化します。
// これにより、別の AWS アカウントの Bedrock リソースへのアクセスが可能になります。
const initBedrockClient = () => __awaiter(void 0, void 0, void 0, function* () {
    // CROSS_ACCOUNT_BEDROCK_ROLE_ARN が設定されているかチェック
    if (process.env.CROSS_ACCOUNT_BEDROCK_ROLE_ARN) {
        // STS から一時的な認証情報を取得してクライアントを初期化
        const tempCredentials = yield assumeRole(process.env.CROSS_ACCOUNT_BEDROCK_ROLE_ARN);
        if (!tempCredentials.accessKeyId || !tempCredentials.secretAccessKey || !tempCredentials.sessionToken) {
            throw new Error('STSからの認証情報が不完全です。');
        }
        return new client_bedrock_runtime_1.BedrockRuntimeClient({
            region: process.env.MODEL_REGION,
            credentials: {
                accessKeyId: tempCredentials.accessKeyId,
                secretAccessKey: tempCredentials.secretAccessKey,
                sessionToken: tempCredentials.sessionToken,
            },
        });
    }
    else {
        // STSを使用しない場合のクライアント初期化
        return new client_bedrock_runtime_1.BedrockRuntimeClient({
            region: process.env.MODEL_REGION,
        });
    }
});
const createConverseCommandInput = (model, messages, id) => {
    const modelConfig = models_1.BEDROCK_TEXT_GEN_MODELS[model];
    return modelConfig.createConverseCommandInput(messages, id, model, modelConfig.defaultParams, modelConfig.usecaseParams);
};
const createConverseStreamCommandInput = (model, messages, id) => {
    const modelConfig = models_1.BEDROCK_TEXT_GEN_MODELS[model];
    return modelConfig.createConverseStreamCommandInput(messages, id, model, modelConfig.defaultParams, modelConfig.usecaseParams);
};
const extractConverseOutputText = (model, output) => {
    const modelConfig = models_1.BEDROCK_TEXT_GEN_MODELS[model];
    return modelConfig.extractConverseOutputText(output);
};
const extractConverseStreamOutputText = (model, output) => {
    const modelConfig = models_1.BEDROCK_TEXT_GEN_MODELS[model];
    return modelConfig.extractConverseStreamOutputText(output);
};
const createBodyImage = (model, params) => {
    const modelConfig = models_1.BEDROCK_IMAGE_GEN_MODELS[model];
    return modelConfig.createBodyImage(params);
};
const extractOutputImage = (model, response) => {
    const modelConfig = models_1.BEDROCK_IMAGE_GEN_MODELS[model];
    return modelConfig.extractOutputImage(response);
};
const bedrockApi = {
    invoke: (model, messages, id) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield initBedrockClient();
        const converseCommandInput = createConverseCommandInput(model.modelId, messages, id);
        const command = new client_bedrock_runtime_1.ConverseCommand(converseCommandInput);
        const output = yield client.send(command);
        return extractConverseOutputText(model.modelId, output);
    }),
    invokeStream: function (model, messages, id) {
        return __asyncGenerator(this, arguments, function* () {
            var _a, e_1, _b, _c;
            const client = yield __await(initBedrockClient());
            try {
                const converseStreamCommandInput = createConverseStreamCommandInput(model.modelId, messages, id);
                const command = new client_bedrock_runtime_1.ConverseStreamCommand(converseStreamCommandInput);
                const responseStream = yield __await(client.send(command));
                if (!responseStream.stream) {
                    return yield __await(void 0);
                }
                try {
                    for (var _d = true, _e = __asyncValues(responseStream.stream), _f; _f = yield __await(_e.next()), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const response = _c;
                        if (!response) {
                            break;
                        }
                        const outputText = extractConverseStreamOutputText(model.modelId, response);
                        if (outputText) {
                            yield yield __await((0, streamingChunk_1.streamingChunk)({ text: outputText }));
                        }
                        if (response.messageStop) {
                            yield yield __await((0, streamingChunk_1.streamingChunk)({
                                text: '',
                                stopReason: response.messageStop.stopReason,
                            }));
                            break;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (e) {
                if (e instanceof client_bedrock_runtime_1.ThrottlingException || e instanceof client_bedrock_runtime_1.ServiceQuotaExceededException) {
                    yield yield __await((0, streamingChunk_1.streamingChunk)({
                        text: 'ただいまアクセスが集中しているため時間をおいて試してみてください。',
                    }));
                }
                else if (e instanceof client_bedrock_runtime_1.AccessDeniedException) {
                    const modelAccessURL = `https://${process.env.MODEL_REGION}.console.aws.amazon.com/bedrock/home?region=${process.env.MODEL_REGION}#/modelaccess`;
                    yield yield __await((0, streamingChunk_1.streamingChunk)({
                        text: `選択したモデルが有効化されていないようです。[Bedrock コンソールの Model Access 画面](${modelAccessURL})にて、利用したいモデルを有効化してください。`,
                    }));
                }
                else {
                    console.error(e);
                    yield yield __await((0, streamingChunk_1.streamingChunk)({
                        text: 'エラーが発生しました。時間をおいて試してみてください。',
                    }));
                }
            }
        });
    },
    generateImage: (model, params) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield initBedrockClient();
        // Stable Diffusion や Titan Image Generator を利用した画像生成は Converse API に対応していないため、InvokeModelCommand を利用する
        const command = new client_bedrock_runtime_1.InvokeModelCommand({
            modelId: model.modelId,
            body: createBodyImage(model.modelId, params),
            contentType: 'application/json',
        });
        const res = yield client.send(command);
        const body = JSON.parse(Buffer.from(res.body).toString('utf-8'));
        return extractOutputImage(model.modelId, body);
    }),
};
exports.default = bedrockApi;
