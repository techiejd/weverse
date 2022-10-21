import * as admin from 'firebase-admin';
import {
  getApp,
  initializeApp,
} from "firebase-admin/app";
import {Challenge} from '../modules/sofia/schemas';
import { logger } from './logger';

const db = (() => {
  try {
    getApp();
  } catch {
    initializeApp();
  }
  return admin.firestore();
})()

export const getUserSnapshot = async (psid: string) => {
  const snapshot = await db.collection('users').where('psid', '==', psid)
      .get();
  if (snapshot.empty) {
    logger.error({psid: psid}, "Error: PSID did not return any snapshot.")
    throw new Error('LOG_IN_NECESSARY');
  }
  return snapshot.docs[0];
};

export const getAllUsersSnapshot = async () => {
  return db.collection('users').get();
};

export const addChallenge = async (challenge: Challenge) => {
  return db.collection('challenges').add(challenge);
};

export const usedSource = async (psid: string, challengeRef: string) => {
  // TODO(techiejd): They didn't really accept a challenge but
  // rather they used a source for their new resources.
  // So, acceptedChallenges -> usedSource.
  const userSnapshot = await getUserSnapshot(psid);
  const user = userSnapshot.data();
  const priorAcceptedChallenges: string[] | undefined = user.acceptedChallenges;
  let newAcceptedChallenges: string[];
  if (priorAcceptedChallenges != undefined) {
    priorAcceptedChallenges.push(challengeRef);
    newAcceptedChallenges = priorAcceptedChallenges;
  } else {
    newAcceptedChallenges = [challengeRef];
  }
  return await userSnapshot.ref.update({
    acceptedChallenges: newAcceptedChallenges,
  });
};
