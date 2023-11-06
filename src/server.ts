import "module-alias/register";
import { variables, logger } from "./config";
import mongoose from "mongoose";
import http from 'http';
import serverApp from "@/app";

const app = serverApp();
const server = http.createServer(app);
const port = variables.PORT;
const URI = variables.MONGO_DB_URI;

app.set('port', port);

function onError(error: any) {
    if (error.syscall !== 'listen') throw error;

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            logger.error(bind + ' requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            logger.error(bind + ' is already in use');
            process.exit(1);
        default:
            throw error;
    }
}

function onListening() {
    const address = server.address();
    const bind = typeof address === 'string'
        ? 'pipe ' + address
        : 'port ' + address?.port;
    logger.info('server active on ' + bind);
}

server.on('listening', onListening);
server.on('error', onError);

mongoose
    .connect(URI)
    .then(() => logger.info("connected to database"))
    .then(() => server.listen(port));
