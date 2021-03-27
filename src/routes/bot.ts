import { Router, Request, Response } from 'express';
import { search } from '../services/botService';

const router = Router();

router.post('/search', (req: Request, res: Response) => {
    const { q } = req.query;
    try {
        search(String(q));
        res.json({ msg: 'ok' });
    } catch (e) {
        console.log(e);
        throw new Error(`Failed due to: ${e}`);
    }
});

export default router;
