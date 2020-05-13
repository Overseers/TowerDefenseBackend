import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import swaggerUI from 'swagger-ui-express';
import swaggerDocs from 'swagger-jsdoc';
import { V1, V2 } from './Routes/*';
import { SwaggerOptions } from './util/swaggerOptions';

const router = express.Router();
const swaggerSpec = swaggerDocs(SwaggerOptions);

/**
 * @swagger
 * 
 * tags:
 *   name: NewTag
 *   description: new tag with description
 */

router.use(cookieParser());

router.use('/public', express.static(path.resolve('./public')));
// router.use(
//     '/static/',
//     express.static(path.resolve('../PathToFrontendReact/build/static/'))
// );

/**
 * @swagger
 * 
 * definitions:
 *   Output:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 */

//Add in V1 Router
router.use('/V1', V1);

//Add in V2 Router
router.use('/V2', V2);

// router.use('/Auth');
// router.use('/Game');
// router.use('/Security');
// router.use('/User');

//Swagger Routes
router.use('/api', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

router.get('/', (request, response) => {
    response.sendFile(path.resolve('./public/index.html'));
});

//Catch whatever misses the routes
router.get('/*', (request, response) =>
    response.send({
        message:
            'Failed to find correct route. Please check the route and try again.',
    })
);

export default router;
