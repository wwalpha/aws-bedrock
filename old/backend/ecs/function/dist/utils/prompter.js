"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePrompt = void 0;
const generatePrompt = (pt, messages) => {
    const prompt = pt.prefix +
        messages
            .map((message) => {
            if (message.role == 'user') {
                return pt.user.replace('{}', message.content);
            }
            else if (message.role == 'assistant') {
                return pt.assistant.replace('{}', message.content);
            }
            else if (message.role === 'system') {
                return pt.system.replace('{}', message.content);
            }
            else {
                throw new Error(`Invalid message role: ${message.role}`);
            }
        })
            .join(pt.join) +
        pt.suffix;
    return prompt;
};
exports.generatePrompt = generatePrompt;
