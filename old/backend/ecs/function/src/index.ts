import { Logger } from '@utils';
import app from './app';

const server = app.listen(process.env['EXPOSE_PORT'] || 8080, () => {
  Logger.info('Started...');
  Logger.info('Port: ', process.env['EXPOSE_PORT'] || 8080);

  console.log('started...');
});

// timeout 20s
server.timeout = 1000 * 20;