import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { search } from '../services/botService';

const router = Router();

router.post('/search', body('query').notEmpty().isString(), body('count').notEmpty().isNumeric(), async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { query, count } = req.body;

    try {
        const data = await search(query, count);
        return res.status(200).json({ data });
    } catch (e) {
        res.status(500).json({ msg: 'Server Error' });
        throw new Error(`Failed due to: ${e}`);
    }
});

export default router;
