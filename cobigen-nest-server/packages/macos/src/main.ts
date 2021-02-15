import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response } from 'express';
import properties from './config/properties';
import * as bodyParser from 'body-parser';

// We need these variables for resetting the timeout
let counter: number = 0;
let time: NodeJS.Timeout;
// Will hold the server
let server;

/**
 * This function resets the current timeout.
 * We don't want to close the server if we have just received a new request.
 * @export
 * @param {Request} req the current request
 * @param {Response} res the result of the request
 * @param {*} next  to pass control to the next middleware function. Otherwise, the request will be left hanging.
 */
export function resetTimeout(req: Request, res: Response, next) {
  counter++;

  if (counter % 2 === 0) {
    // We need to start again the timeout
    time = setTimeout(() => {
      if (server === undefined) {
        // If no server is found, let's just exit
        process.exit();
      } else {
        // Gracefully close the server
        server.close();
      }
    }, properties.timeout);
    // The request should be passed to the controller
    next();
  } else {
    // Let's clear the timeout and then set it again
    clearTimeout(time);
    resetTimeout(req, res, next);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Port is passed as argument when creating the process
  let port: string = process.argv[2];
  // We need to parse long JSON files on requests
  app.use(bodyParser.json({ limit: '12mb' }));
  app.use(bodyParser.urlencoded({ limit: '12mb', extended: true }));

  if (port === undefined) {
    // Default port when no parameter was passed
    port = '5000';
  }

  server = await app.listen(port);

  // We set the timeout, so that the server gets closed after some time of inactivity
  time = setTimeout(() => {
    server.close();
  }, properties.timeout);
}
bootstrap();
