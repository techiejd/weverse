import {MigrateOptions} from "fireway";
import {contentConverter,
  posiFormDataConverter, socialProofConverter} from "../src/utils";

export const migrate = async ({firestore, Timestamp} : MigrateOptions) => {
  const batch = firestore.batch();
  const contentCollection =
  firestore.collection("content").withConverter(contentConverter);
  const addActionContent =
  firestore.collection("impacts").withConverter(posiFormDataConverter)
    .get().then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const action = doc.data();
        batch.create(
          contentCollection.doc(doc.id),
          {type: "action", data: action,
            createdAt: action.createdAt});
      });
    });
  const addSocialProofContent = firestore.collection("socialProofs")
    .withConverter(socialProofConverter).get().then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const sProof = doc.data();
        if (sProof.videoUrl) {
          batch.create(
            contentCollection.doc(doc.id),
            {type: "socialProof", data: sProof,
              createdAt: sProof.createdAt});
        }
      });
    });
  await Promise.all([addSocialProofContent, addActionContent]);
  await batch.commit();
};
