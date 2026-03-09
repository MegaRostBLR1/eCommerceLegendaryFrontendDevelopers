import dotenv from 'dotenv';
dotenv.config();

export const ConfigFactory = () => ({
    port: process.env['PORT'] || 3000,
    appPrefix: process.env['APP_PREFIX'],
    namespace: process.env['NAMESPACE'] || 'development',
    env: process.env['NODE_ENV'],
    testEmails: process.env['TEST_EMAILS'],
    accessToken: process.env['ACCESS_TOKEN_KEY'],
    tokenLife: Number(process.env['TOKEN_LIFE']),
    mediaFolder: process.env['MEDIA_FOLDER'],
});
