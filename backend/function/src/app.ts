import express from 'express';
import { urlencoded } from 'body-parser';
import entry from './entry';
import chatRegist from './apis/chatRegist';
import chatList from './apis/predict';

const app = express();

app.use(urlencoded({ extended: true }));
app.disable('x-powered-by');

app.options('*', (_, res) => res.sendStatus(200));
// health check
app.get('/health', (_, res) => res.send('backend'));

app.post('/predict', express.json(), (req, res) => entry(req, res, chatList));
app.post('/predict/title', express.json(), (req, res) => entry(req, res, chatRegist));

app.post('/image/generate', express.json(), (req, res) => entry(req, res, chatList));

app.delete('/file/:fileName', express.json(), (req, res) => entry(req, res, chatList));
app.get('/file/url', express.json(), (req, res) => entry(req, res, chatList));
app.post('/file/url', express.json(), (req, res) => entry(req, res, chatList));

app.get('/transcribe/result/:jobName', express.json(), (req, res) => entry(req, res, chatList));
app.post('/transcribe/start', express.json(), (req, res) => entry(req, res, chatList));
app.post('/transcribe/url', express.json(), (req, res) => entry(req, res, chatList));

app.get('/webtext', express.json(), (req, res) => entry(req, res, chatList));

export default app;
