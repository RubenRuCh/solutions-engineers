import { Server } from '../../../../src/Apps/couriers/backend/server';

const port = process.env.COURIERS_BACK_PORT || '3000';
const server = new Server(port);
const express = server.expressApp;

const app = express.listen();

export default app;
