import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../../../../.env' });

import { CouriersBackendApp } from './CouriersBackendApp';

try {
  new CouriersBackendApp().start().catch(handleError);
} catch (e) {
  handleError(e);
}

process.on('uncaughtException', err => {
  console.log('uncaughtException', err);
  process.exit(1);
});

function handleError(e: any) {
  console.log(e);
  process.exit(1);
}
