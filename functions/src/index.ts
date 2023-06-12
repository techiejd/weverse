import * as functions from "firebase-functions";
import {maker} from "../shared";
import {getFirestore} from "firebase-admin/firestore";
import {initializeApp} from "firebase-admin/app";
import {contentConverter, makerConverter, posiFormDataConverter,
  socialProofConverter} from "./utils";

initializeApp();

const testimonialsPath = "socialProofs/{socialProofId}";
const actionsPath = "impacts/{actionId}";
const getContentDocRef = (snapshot: functions.firestore.QueryDocumentSnapshot,
  store: FirebaseFirestore.Firestore) => store.doc(`content/${snapshot.id}`)
  .withConverter(contentConverter);

export const testimonialAdded =
functions.firestore.document(testimonialsPath)
  .onCreate((snapshot) => {
    const store = getFirestore();
    const sProof = socialProofConverter
      .fromFirestore(snapshot);
    const promises = [];
    if (sProof.forAction) {
      promises.push(store.doc(`impacts/${sProof.forAction}`)
        .withConverter(posiFormDataConverter)
        .get().then((actionDocSnap) => {
          const action = actionDocSnap.data();
          action && actionDocSnap.ref.update({
            ratings: action.ratings && action.ratings.sum &&
            sProof.rating && action.ratings.count ? {
                sum: action.ratings.sum + sProof.rating,
                count: action.ratings.count + 1,
              } : {sum: sProof.rating, count: 1},
          });
        }));
    }
    promises.push(store.doc(`makers/${sProof.forMaker}`)
      .withConverter(makerConverter)
      .get().then((makerDocSnap) => {
        const m = maker.parse(makerDocSnap.data());
        makerDocSnap.ref.update({
          ratings: m.ratings && m.ratings.sum &&
          sProof.rating && m.ratings.count ? {
              sum: m.ratings.sum + sProof.rating,
              count: m.ratings.count + 1,
            } : {sum: sProof.rating, count: 1},
        });
      }));
    if (sProof.videoUrl) {
      promises.push(getContentDocRef(snapshot, store).create({
        type: "socialProof",
        data: sProof,
      }));
    }
    return Promise.all(promises);
  });

export const testimonialDeleted = functions.firestore.document(testimonialsPath)
  .onDelete((snapshot) => getContentDocRef(snapshot, getFirestore()).delete());

export const actionAdded = functions.firestore.document(actionsPath).onCreate(
  (snapshot) => getContentDocRef(snapshot, getFirestore())
    .create({type: "action", data: snapshot.data()}
    ));

export const actionModified = functions.firestore.document(actionsPath)
  .onUpdate((change) =>
    getContentDocRef(change.after, getFirestore())
      .set({type: "action", data: change.after.data()}));

export const actionDeleted = functions.firestore.document(actionsPath)
  .onDelete(async (snapshot) => {
    const store = getFirestore();
    const action = posiFormDataConverter.fromFirestore(snapshot);
    const batch = store.batch();
    batch.delete(getContentDocRef(snapshot, store));
    const promises : [
      Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>>,
      Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>>,
      Promise<
      FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>>
      | Promise<undefined>]=
        [store.collection("socialProofs")
          .where("forAction", "==", snapshot.id).get(),
        snapshot.ref.collection("likes").get(),
        action.makerId ?
          store.doc(`makers/${action.makerId}`).get() :
          Promise.resolve(undefined)];

    const [socialProofsCollection,
      likesCollection, makerDoc] =
    await Promise.all(promises);
    let actionRatings = {sum: 0, count: 0};
    socialProofsCollection.forEach((socialProofSnapshot) => {
      const socialProof =
      socialProofConverter.fromFirestore(socialProofSnapshot);
      actionRatings = {
        sum:
        actionRatings.sum + (socialProof?.rating ? socialProof.rating : 0),
        count: actionRatings.count + 1};
      batch.delete(socialProofSnapshot.ref);
    });
    likesCollection.forEach((likeSnapshot) => {
      const fromMember = likeSnapshot.id;
      const memberLike = store.doc(`members/${fromMember}/likes/${action.id}`);
      batch.delete(memberLike);
      batch.delete(likeSnapshot.ref);
    });
    if (makerDoc && actionRatings.count) {
      const m = makerDoc.data();
      batch.update(makerDoc.ref,
        {...m,
          ratings:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          {sum: m!.ratings!.sum! - actionRatings.sum,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            count: m!.ratings!.count! - actionRatings.count}});
    }

    return batch.commit();
  }
  );
