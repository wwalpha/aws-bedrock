import express from 'express';
import { urlencoded } from 'body-parser';
import entry from './entry';
import registChat from './apis/registChat';
import registMessage from './apis/registMessage';
import registSystemContext from './apis/registSystemContext';
import updateSystemContextTitle from './apis/updateSystemContextTitle';
import updateChatTitle from './apis/updateChatTitle';
import getChat from './apis/getChat';
import listMessage from './apis/listMessage';
import listChat from './apis/listChat';
import listSystemContext from './apis/listSystemContext';
import deleteChat from './apis/deleteChat';
import deleteSystemContext from './apis/deleteSystemContext';
import feedbackUpdate from './apis/feedbackUpdate';

const app = express();

app.use(urlencoded({ extended: true }));
app.disable('x-powered-by');

app.options('*', (_, res) => res.sendStatus(200));
// health check
app.get('/health', (_, res) => res.send('backend'));

app.get('/chats', express.json(), (req, res) => entry(req, res, listChat));
app.post('/chats', express.json(), (req, res) => entry(req, res, registChat));
app.delete('/chats/:chatId', express.json(), (req, res) => entry(req, res, deleteChat));
app.get('/chats/:chatId', express.json(), (req, res) => entry(req, res, getChat));
app.post('/chats/:chatId/feedbacks', express.json(), (req, res) => entry(req, res, feedbackUpdate));
app.get('/chats/:chatId/messages', express.json(), (req, res) => entry(req, res, listMessage));
app.post('/chats/:chatId/messages', express.json(), (req, res) => entry(req, res, registMessage));
app.put('/chats/:chatId/title', express.json(), (req, res) => entry(req, res, updateChatTitle));

app.get('/systemcontexts', express.json(), (req, res) => entry(req, res, listSystemContext));
app.post('/systemcontexts', express.json(), (req, res) => entry(req, res, registSystemContext));
app.delete('/systemcontexts/:systemContextId', express.json(), (req, res) => entry(req, res, deleteSystemContext));
app.put('/systemcontexts/:systemContextId/title', express.json(), (req, res) =>
  entry(req, res, updateSystemContextTitle)
);

app.get('/shares/chat/:chatId', express.json(), (req, res) => entry(req, res, deleteSystemContext));
app.post('/shares/chat/:chatId', express.json(), (req, res) => entry(req, res, deleteSystemContext));
app.get('/shares/share/:shareId', express.json(), (req, res) => entry(req, res, deleteSystemContext));
app.delete('/shares/share/:shareId', express.json(), (req, res) => entry(req, res, deleteSystemContext));

export default app;
