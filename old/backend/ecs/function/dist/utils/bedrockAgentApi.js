"use strict";
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
const client_bedrock_agent_runtime_1 = require("@aws-sdk/client-bedrock-agent-runtime");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const streamingChunk_1 = require("./streamingChunk");
const agentMap = JSON.parse(process.env.AGENT_MAP || '{}');
const client = new client_bedrock_agent_runtime_1.BedrockAgentRuntimeClient({
    region: process.env.AGENT_REGION,
});
const s3Client = new client_s3_1.S3Client({});
const bedrockAgentApi = {
    invokeStream: function (model, messages) {
        return __asyncGenerator(this, arguments, function* () {
            var _a, e_1, _b, _c;
            var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            try {
                const command = new client_bedrock_agent_runtime_1.InvokeAgentCommand({
                    sessionState: {
                        files: ((_d = messages[messages.length - 1].extraData) === null || _d === void 0 ? void 0 : _d.map((file) => ({
                            name: file.name.replace(/[^a-zA-Z0-9\s\-()[\].]/g, 'X'), // ファイル名に日本語などが入っていると認識されないため置き換え
                            source: {
                                sourceType: 'BYTE_CONTENT',
                                byteContent: {
                                    mediaType: file.source.mediaType,
                                    data: Buffer.from(file.source.data, 'base64'),
                                },
                            },
                            useCase: 'CODE_INTERPRETER',
                        }))) || [],
                    },
                    agentId: agentMap[model.modelId].agentId,
                    agentAliasId: agentMap[model.modelId].aliasId,
                    sessionId: model.sessionId,
                    enableTrace: true,
                    inputText: messages[messages.length - 1].content,
                });
                const res = yield __await(client.send(command));
                if (!res.completion) {
                    return yield __await(void 0);
                }
                try {
                    for (var _p = true, _q = __asyncValues(res.completion), _r; _r = yield __await(_q.next()), _a = _r.done, !_a; _p = true) {
                        _c = _r.value;
                        _p = false;
                        const streamChunk = _c;
                        if (streamChunk.chunk) {
                            // Chunk の追加
                            let body = new TextDecoder('utf-8').decode((_e = streamChunk.chunk) === null || _e === void 0 ? void 0 : _e.bytes);
                            // Attribution の追加
                            const sources = {};
                            let offset = 0;
                            for (const citation of ((_g = (_f = streamChunk.chunk) === null || _f === void 0 ? void 0 : _f.attribution) === null || _g === void 0 ? void 0 : _g.citations) || []) {
                                for (const ref of citation.retrievedReferences || []) {
                                    // S3 URI を取得し URL に変換
                                    const s3Uri = ((_j = (_h = ref === null || ref === void 0 ? void 0 : ref.location) === null || _h === void 0 ? void 0 : _h.s3Location) === null || _j === void 0 ? void 0 : _j.uri) || '';
                                    if (!s3Uri)
                                        continue;
                                    const [bucket, ...objectPath] = s3Uri.slice(5).split('/');
                                    const objectName = objectPath.join('/');
                                    const url = `https://${bucket}.s3.amazonaws.com/${objectName})`;
                                    // データソースがユニークであれば文末に Reference 追加
                                    if (sources[url] === undefined) {
                                        sources[url] = Object.keys(sources).length;
                                        body += `\n[^${sources[url]}]: ${url}`;
                                    }
                                    const referenceId = sources[url];
                                    // 文中に Reference 追加
                                    const position = (((_m = (_l = (_k = citation.generatedResponsePart) === null || _k === void 0 ? void 0 : _k.textResponsePart) === null || _l === void 0 ? void 0 : _l.span) === null || _m === void 0 ? void 0 : _m.end) || 0) + offset + 1;
                                    const referenceText = `[^${referenceId}]`;
                                    offset += referenceText.length;
                                    body = body.slice(0, position) + referenceText + body.slice(position);
                                }
                            }
                            if (body) {
                                yield yield __await((0, streamingChunk_1.streamingChunk)({ text: body }));
                            }
                        }
                        // File の追加
                        if (streamChunk.files) {
                            for (const file of streamChunk.files.files || []) {
                                // ファイルを S3 にアップロード
                                const uuid = (0, uuid_1.v4)();
                                const bucket = process.env.BUCKET_NAME;
                                const key = `${uuid}/${file.name}`;
                                const command = new client_s3_1.PutObjectCommand({
                                    Bucket: bucket,
                                    Key: key,
                                    Body: file.bytes,
                                });
                                yield __await(s3Client.send(command));
                                const url = `https://${bucket}.s3.amazonaws.com/${key}`;
                                // Yield file path
                                if (((_o = file.type) === null || _o === void 0 ? void 0 : _o.split('/')[0]) === 'image') {
                                    yield yield __await((0, streamingChunk_1.streamingChunk)({ text: `\n![${file.name}](${url})` }));
                                }
                                else {
                                    yield yield __await((0, streamingChunk_1.streamingChunk)({ text: `\n[${file.name}](${url})` }));
                                }
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_p && !_a && (_b = _q.return)) yield __await(_b.call(_q));
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (e) {
                if (e instanceof client_bedrock_agent_runtime_1.ThrottlingException || e instanceof client_bedrock_agent_runtime_1.ServiceQuotaExceededException) {
                    yield yield __await((0, streamingChunk_1.streamingChunk)({
                        text: 'ただいまアクセスが集中しているため時間をおいて試してみてください。',
                    }));
                }
                else if (e instanceof client_bedrock_agent_runtime_1.DependencyFailedException) {
                    const modelAccessURL = `https://${process.env.AGENT_REGION}.console.aws.amazon.com/bedrock/home?region=${process.env.AGENT_REGION}#/modelaccess`;
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
};
exports.default = bedrockAgentApi;
