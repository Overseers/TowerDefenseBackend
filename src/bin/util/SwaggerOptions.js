import { name } from '../../../package.json';

export const SwaggerOptions = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'API DOCS',
            description: 'Description for API DOCS',
            contact: { name: 'Name Here', email: 'email@email.com' },
        },
        servers: [
            { url: 'https://server-name-here.com' },
            { url: `http://localhost:8090/${name}` },
        ],
    },
    apis: ['./src/bin/default.js', './src/bin/Routes/*.js'],
};
