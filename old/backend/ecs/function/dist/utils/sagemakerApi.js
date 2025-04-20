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
const client_sagemaker_runtime_1 = require("@aws-sdk/client-sagemaker-runtime");
const prompter_1 = require("./prompter");
const models_1 = require("./models");
const streamingChunk_1 = require("./streamingChunk");
const client = new client_sagemaker_runtime_1.SageMakerRuntimeClient({
    region: process.env.MODEL_REGION,
});
const TGI_DEFAULT_PARAMS = {
    max_new_tokens: 512,
    return_full_text: false,
    do_sample: true,
    temperature: 0.3,
};
const createBodyText = (model, messages, stream) => {
    return JSON.stringify({
        inputs: (0, prompter_1.generatePrompt)((0, models_1.getSageMakerModelTemplate)(model), messages),
        parameters: TGI_DEFAULT_PARAMS,
        stream: stream,
    });
};
const sagemakerApi = {
    invoke: (model, messages) => __awaiter(void 0, void 0, void 0, function* () {
        const command = new client_sagemaker_runtime_1.InvokeEndpointCommand({
            EndpointName: model.modelId,
            Body: createBodyText(model.modelId, messages, false),
            ContentType: 'application/json',
            Accept: 'application/json',
        });
        const data = yield client.send(command);
        return JSON.parse(new TextDecoder().decode(data.Body))[0].generated_text;
    }),
    invokeStream: function (model, messages) {
        return __asyncGenerator(this, arguments, function* () {
            var _a, e_1, _b, _c;
            var _d;
            const command = new client_sagemaker_runtime_1.InvokeEndpointWithResponseStreamCommand({
                EndpointName: model.modelId,
                Body: createBodyText(model.modelId, messages, true),
                ContentType: 'application/json',
                Accept: 'application/json',
            });
            const stream = (yield __await(client.send(command))).Body;
            if (!stream)
                return yield __await(void 0);
            // https://aws.amazon.com/blogs/machine-learning/elevating-the-generative-ai-experience-introducing-streaming-support-in-amazon-sagemaker-hosting/
            // The output of the model will be in the following format:
            // b'data:{"token": {"text": " a"}}\n\n'
            // b'data:{"token": {"text": " challenging"}}\n\n'
            // b'data:{"token": {"text": " problem"
            // b'}}'
            //
            // While usually each PayloadPart event from the event stream will contain a byte array
            // with a full json, this is not guaranteed and some of the json objects may be split across
            // PayloadPart events. For example:
            // {'PayloadPart': {'Bytes': b'{"outputs": '}}
            // {'PayloadPart': {'Bytes': b'[" problem"]}\n'}}
            //
            // This logic accounts for this by concatenating bytes and
            // return lines (ending with a '\n' character) within the buffer.
            // It will also save any pending lines that doe not end with a '\n'
            // to make sure truncations are concatenated.
            let buffer = '';
            const pt = (0, models_1.getSageMakerModelTemplate)(model.modelId);
            try {
                for (var _e = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield __await(stream_1.next()), _a = stream_1_1.done, !_a; _e = true) {
                    _c = stream_1_1.value;
                    _e = false;
                    const chunk = _c;
                    buffer += new TextDecoder().decode((_d = chunk.PayloadPart) === null || _d === void 0 ? void 0 : _d.Bytes);
                    if (!buffer.endsWith('\n'))
                        continue;
                    // When buffer end with \n it can be parsed
                    const lines = buffer.split('\n').filter((line) => line.trim().startsWith('data:')) || [];
                    for (const line of lines) {
                        const message = line.replace(/^data:/, '');
                        const token = JSON.parse(message).token.text || '';
                        if (!token.includes(pt.eosToken))
                            yield yield __await((0, streamingChunk_1.streamingChunk)({ text: token }));
                    }
                    buffer = '';
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_e && !_a && (_b = stream_1.return)) yield __await(_b.call(stream_1));
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    },
    generateImage: () => __awaiter(void 0, void 0, void 0, function* () {
        throw new Error('Not Implemented');
    }),
};
exports.default = sagemakerApi;
