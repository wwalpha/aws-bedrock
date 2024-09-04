import express from 'express';
import { urlencoded } from 'body-parser';
import entry from './entry';
import chatList from './apis/predict';
import predict from './apis/predict';
import predictTitle from './apis/predictTitle';
import generateImage from './apis/generateImage';
import deleteFile from './apis/deleteFile';
import getFileDownloadSignedUrl from './apis/getFileDownloadSignedUrl';
import getFileUploadSignedUrl from './apis/getFileUploadSignedUrl';
import getWebText from './apis/getWebText';

const app = express();

app.use(urlencoded({ extended: true }));
app.disable('x-powered-by');

app.options('*', (_, res) => res.sendStatus(200));
// health check
app.get('/health', (_, res) => res.send('backend'));

app.post('/predict', express.json(), (req, res) => entry(req, res, predict));
app.post('/predict/title', express.json(), (req, res) => entry(req, res, predictTitle));

app.post('/image/generate', express.json(), (req, res) => entry(req, res, generateImage));

app.delete('/file/:fileName', express.json(), (req, res) => entry(req, res, deleteFile));
app.get('/file/url', express.json(), (req, res) => entry(req, res, getFileDownloadSignedUrl));
app.post('/file/url', express.json(), (req, res) => entry(req, res, getFileUploadSignedUrl));

// app.get('/transcribe/result/:jobName', express.json(), (req, res) => entry(req, res, chatList));
// app.post('/transcribe/start', express.json(), (req, res) => entry(req, res, chatList));
// app.post('/transcribe/url', express.json(), (req, res) => entry(req, res, chatList));

app.get('/webtext', express.json(), (req, res) => entry(req, res, getWebText));

export default app;
