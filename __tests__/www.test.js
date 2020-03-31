import setApp from '../src/bin/util/www';

describe('make sure app returns like it is suppose to', () => {
    test('make sure it builds', () => {
        expect(setApp).toEqual(expect.anything());
    });
});