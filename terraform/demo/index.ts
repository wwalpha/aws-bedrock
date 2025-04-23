import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('combined'));

// health check
// @ts-ignore
app.get('/', (_, res) => res.status(200).send());
// public service
// @ts-ignore
app.get('/api/local', (_, res) => res.send('Hello world'));

app.listen(process.env.EXPOSE_PORT || 8080, () => {
  console.log('Started...');
  console.log('Port: ', process.env.EXPOSE_PORT || 8080);
});
