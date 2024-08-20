import express from 'express';
import { urlencoded } from 'body-parser';
import entry from './entry';
import registChat from './apis/chatRegist';
import chatDelete from './apis/chatDelete';
import feedbackUpdate from './apis/feedbackUpdate';
import titleUpdate from './apis/titleUpdate';
import messageList from './apis/messageList';
import messageRegist from './apis/messageRegist';
import chatGet from './apis/chatGet';
import chatList from './apis/chatList';

const app = express();

app.use(urlencoded({ extended: true }));
app.disable('x-powered-by');

app.options('*', (_, res) => res.sendStatus(200));
// health check
app.get('/health', (_, res) => res.send('backend'));

app.get('/chats', express.json(), (req, res) => entry(req, res, chatList));
app.post('/chats', express.json(), (req, res) => entry(req, res, registChat));

app.delete('/chats/:chatId', express.json(), (req, res) => entry(req, res, chatDelete));
app.get('/chats/:chatId', express.json(), (req, res) => entry(req, res, chatGet));

app.post('/chats/:chatId/feedbacks', express.json(), (req, res) => entry(req, res, feedbackUpdate));

app.get('/chats/:chatId/messages', express.json(), (req, res) => entry(req, res, messageList));
app.post('/chats/:chatId/messages', express.json(), (req, res) => entry(req, res, messageRegist));

app.put('/chats/:chatId/title', express.json(), (req, res) => entry(req, res, titleUpdate));

export default app;
