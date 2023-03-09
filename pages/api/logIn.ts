// ./pages/api/login
import { NextApiRequest, NextApiResponse } from 'next';
import { setAuthCookies } from 'next-firebase-auth'
import initAuth from '../../common/context/firebase/initAuth';
import { logger } from '../../common/logger';

initAuth()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  logger.info("Ayo logging in!");
  try {
    await setAuthCookies(req, res)
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.' })
  }
  return res.status(200).json({ success: true })
}

export default handler