import express from 'express';
import cors from 'cors';
import os from 'node:os';
// import path from 'node:path';
import { ConfigFactory } from './config/config-factory';
import { setAuthorizationsHeaders } from './middlewares/auth/set-auth-headers.middleware';
import path from 'node:path';
// import { errorHandler } from './exceptions/handler';
import { isEqual } from 'lodash';
import router from './routes/validators/routers';

const config = ConfigFactory();

const port = config.port;
const app = express();

app.use(
    cors({
        origin: ['http://localhost:8080', 'http://127.0.0.1:3000'],
    }),
);

app.use(setAuthorizationsHeaders);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    `/api/${config.mediaFolder}`,
    express.static(path.join(__dirname, !isEqual(config.namespace, 'devlocal') ? `../../${config.mediaFolder}` : `../${config.mediaFolder}`)),
);
app.use(`/${config.appPrefix}`, router);
app.use(router);
// app.use(errorHandler);

async function run() {
    try {
        const osNetwork = os.networkInterfaces();
        console.log(osNetwork);
        const currentIpKey = Object.keys(osNetwork).find((item) => item.includes('wlp')) || '';
        app.listen(port, () => {
            console.log(`
            -------------------------------
            Server on: ${port}
            http://${(osNetwork[currentIpKey] || []).find((item) => item?.family?.includes('IPv4'))?.address || 'not found'}:${port}/
            current time: ${new Date().toISOString()}
            -------------------------------
            `);
        });
    } catch (e) {
        console.log(e);
        process.exit(); // need be code:1
    }
}

run();
