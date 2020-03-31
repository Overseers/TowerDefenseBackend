import { getGoogleLogo } from '../src/bin/services/google';

jest.mock('node-fetch');

describe('google logo fetch', () => {
    test('fetch success', () => {
        global.pass = true;
        getGoogleLogo().then((response) => {
            expect(response).toEqual('pass');
        });
    });

    test('fetch fail', () => {
        global.pass = false;
        getGoogleLogo().catch((err) => {
            console.log('TEST: ', err.toString('utf8'));
            expect(err).toEqual('fail');
        });
    });
});
