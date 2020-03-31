import express from 'express';
import V1 from './controllers/V1';

export default () => {
    const v1 = new V1();
    const router = express.Router();

    // V1 routes go here
    router.get('/', (request, response) => {
        response.send({ message: 'hi' });
    });
    router.get('/V1/ping', v1.getPing);
    router.post('/V1/ping', v1.postPing);
    router.get('/V1/googleLogo', v1.fetchGoogleLogo);

    // V2 and so forth keep getting tacked on below
    // ...

    return router;
};
