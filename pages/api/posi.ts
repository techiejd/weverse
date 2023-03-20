import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);
  return res.status(200).json({ success: true })
}

export default handler