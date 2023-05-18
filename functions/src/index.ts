import * as functions from "firebase-functions";
import {maker} from "../shared";
import {getFirestore} from "firebase-admin/firestore";
import {initializeApp} from "firebase-admin/app";
import {makerConverter, posiFormDataConverter,
  socialProofConverter} from "./utils";

export const testimonialAdded =
functions.firestore.document("socialProofs/{socialProofId}")
  .onCreate((snapshot) =>{
    initializeApp();
    const sProof = socialProofConverter
      .fromFirestore(snapshot);
    const store = getFirestore();
    const promises = [];
    if (sProof.forAction) {
      promises.push(store.doc(`impacts/${sProof.forAction}`)
        .withConverter(posiFormDataConverter)
        .get().then((docSnap) => {
          const action = docSnap.data();
          action && docSnap.ref.update({
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
      .get().then((docSnap) => {
        const m = maker.parse(docSnap.data());
        docSnap.ref.update({
          ratings: m.ratings && m.ratings.sum &&
          sProof.rating && m.ratings.count ? {
              sum: m.ratings.sum + sProof.rating,
              count: m.ratings.count + 1,
            } : {sum: sProof.rating, count: 1},
        });
      }));
    return Promise.all(promises);
  });

