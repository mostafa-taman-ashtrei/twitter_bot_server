import { Router, Request, Response } from 'express';
import { search } from '../services/botService';

const router = Router();

router.post('/search', async (req: Request, res: Response) => {
    const { query } = req.body;
    try {
        const data = await search(String(query));
        return res.status(200).json({ msg: 'Done', data });
    } catch (e) {
        console.log(e);
        res.status(500).json({ msg: 'Server Error' });
        throw new Error(`Failed due to: ${e}`);
    }
});

export default router;
