import express from 'express';
import { urlencoded } from 'body-parser';
import entry from './entry';
import queryKendra from './apis/queryKendra';
import retrieveKendra from './apis/retrieveKendra';

const app = express();

app.use(urlencoded({ extended: true }));
app.disable('x-powered-by');

app.options('*', (_, res) => res.sendStatus(200));
// health check
app.get('/rag/health', (_, res) => res.send('backend'));

app.post('/rag/query', express.json(), (req, res) => entry(req, res, queryKendra));
app.post('/rag/retrieve', express.json(), (req, res) => entry(req, res, retrieveKendra));

export default app;
