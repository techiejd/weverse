import * as admin from "firebase-admin";
import { getApp, initializeApp } from "firebase-admin/app";
import { DraftTransaction, Transaction } from "../modules/db/schemas";
import { Challenge, startingUserGameInfo } from "../modules/sofia/schemas";
import { logger } from "./logger";

const db = (() => {
  try {
    getApp();
  } catch {
    initializeApp();
  }
  return admin.firestore();
})();

export const addUser = async ({
  asid,
  name,
  psid,
  token,
}: {
  asid: string;
  name: string;
  psid: string;
  token: string;
}) => {
  return db.collection("users").add({
    asid: asid,
    name: name,
    psid: psid,
    token: token,
    gameInfo: startingUserGameInfo,
  });
};

export const getUserSnapshot = async (psid: string) => {
  const snapshot = await db.collection("users").where("psid", "==", psid).get();
  if (snapshot.empty) {
    logger.error({ psid: psid }, "Error: PSID did not return any snapshot.");
    throw new Error("LOG_IN_NECESSARY");
  }
  return snapshot.docs[0];
};

export const getAllUsersSnapshot = async () => {
  return db.collection("users").get();
};

export const addChallenge = async (challenge: Challenge) => {
  return db
    .collection("challenges")
    .add(challenge)
    .then((challengeDocRef) => {
      return challengeDocRef.id;
    });
};

export const getAllChallengesSnapshot = async () => {
  return db.collection("challenges").get();
};

export const getChallenge = async (challengeId: string) => {
  return db.collection("challenges").doc(challengeId).get();
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

export const addTx = async (tx: Transaction) => {
  return db.collection("transactions").add(tx);
};

export const getAllTx = () => {
  return db
    .collection("transactions")
    .get()
    .then((transactionSnapshots) => {
      return transactionSnapshots.docs.map((transactionSnapshot) =>
        transactionSnapshot.data()
      );
    });
};

export const getAllDraftTx = () => {
  return db
    .collection("draftTransactions")
    .get()
    .then((draftTransactionsSnapshots) => {
      return draftTransactionsSnapshots.docs.map(
        (draftTransactionsSnapshot) => ({
          ...draftTransactionsSnapshot.data(),
          id: draftTransactionsSnapshot.id,
        })
      );
    });
};

export const addDraftTx = async (draftTx: DraftTransaction) => {
  if (draftTx.route == undefined) {
    db.collection("draftTransactions")
      .add(draftTx)
      .then((ref) => ref.update({ route: ref.id }));
  } else {
    return db.collection("draftTransactions").add(draftTx);
  }
};

export const deleteDraftTxById = async (id: string) => {
  return db.collection("draftTransactions").doc(id).delete();
};

export const getDraftTxById = async (id: string) => {
  return db.collection("draftTransactions").doc(id).get();
};
