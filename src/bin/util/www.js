import express from 'express';
import packageJson from '../../../package.json';
import routesFunc from '../routes';

// Any express middleware gets set here

export default () => {
    const app = express();
    const routes = routesFunc();
    const { name } = packageJson;
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use(`/${name}`, routes);

    return app;
}
