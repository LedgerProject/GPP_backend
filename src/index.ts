// Loopback imports
import { ApplicationConfig } from '@loopback/core';
// GPP imports
import { GPPBackend } from './application';

export { GPPBackend };

export async function main(options: ApplicationConfig = {}) {
  const app = new GPPBackend(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
