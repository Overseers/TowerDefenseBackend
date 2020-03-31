export default () => new Promise((resolve, reject) => {
    if (global.pass === 'pass') {
        return resolve({
            json: () => {
                return global.pass
            }
        });
    } else if (global.pass === 'fail') {
        return reject({
            json: () => {
                return global.pass
            }
        });
    }
});
