// ./pages/api/logout
import { NextApiRequest, NextApiResponse } from 'next';
import { unsetAuthCookies } from 'next-firebase-auth'
import initAuth from '../../common/context/firebase/initAuth'

initAuth()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Ayo logging out!");
  try {
    await unsetAuthCookies(req, res)
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.' })
  }
  return res.status(200).json({ success: true })
}

export default handler