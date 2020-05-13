import express from 'express';
import V2 from '../controllers/V1';
const v2 = new V2();
const router = express.Router();

/**
 * @swagger
 * 
 * /V2/test:
 *   get:
 *     tags:
 *       - NewTag
 *     parameters:
 *       - in: query
 *         name: msg
 *         type: string
 *         required: true
 *         default: hello
 *         description: Message to display
 *       - in: path
 *         name: action
 *         type: string
 *         required: true
 *         default: log
 *         description: Action to take
 *     description: Perform action on msg
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Output'
 *       400:
 *         description: query error
 *       500:
 *         description: internal error
 */

router.get('/test', v2.test);

export default router;
