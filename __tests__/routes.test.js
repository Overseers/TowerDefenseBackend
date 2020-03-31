import { controllerWrapper } from '../src/bin/routes';
import router from '../src/bin/routes';

const controller = jest.fn();
const response = jest.fn();

describe('testing controllerWrapper', () => {
    test('passing controllerWrapper', () => {
        controller.mockReturnValue(new Promise((resolve) => resolve(true)));
        expect(controllerWrapper(controller, null, response)).toBeUndefined();
    });

    test('fail controllerWrapper', () => {
        controller.mockReturnValue(new Promise((resolve, reject) => reject(false)));
        expect(controllerWrapper(controller, null, response)).toBeUndefined();
    });
});

describe('make sure router returns like it is suppose to', () => {
    test('make sure it build', () => {
        expect(router).toEqual(expect.anything());
    });
});
