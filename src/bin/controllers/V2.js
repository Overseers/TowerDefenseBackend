/*
 * Any business logic/data manipulation
 * takes places in here, and there's
 * only 1 method per route. Also, only
 * 1 class per version of APIs.
 */

export default class V2 {
    constructor() {
        return this;
    }

    test = (request, response) => {
        response.send({ message: 'Success v2' });
    };
}
