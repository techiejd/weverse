import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import {
  initiativeConverter,
  posiFormDataConverter,
  socialProofConverter,
} from "./utils";

initializeApp();

const testimonialsUnderInitiativePath =
  "members/{memberId}/initiatives/{initiativeId}/testimonials/{testimonialId}";
const testimonialsUnderActionPath =
  "members/{memberId}/initiatives/{initiativeId}/actions/{actionId}/testimonials/{testimonialId}";

export const testimonialUnderInitiativeAdded = functions.firestore
  .document(testimonialsUnderInitiativePath)
  .onCreate((snapshot, context) => {
    const ids = context.params;
    const store = getFirestore();
    const testimonial = socialProofConverter.fromFirestore(snapshot);
    const initiativeDocRef = store
      .doc(`members/${ids.memberId}/initiatives/${ids.initiativeId}`)
      .withConverter(initiativeConverter);
    return store.runTransaction(async (t) => {
      const initiativeDoc = await t.get(initiativeDocRef);
      const initiative = initiativeDoc.data();
      if (!initiative) {
        throw new Error(`No initiative found for testimonial ${snapshot.id}`);
      }
      t.update(initiativeDoc.ref, {
        ratings:
          initiative.ratings &&
          initiative.ratings.sum &&
          testimonial.rating &&
          initiative.ratings.count
            ? {
                sum: initiative.ratings.sum + testimonial.rating,
                count: initiative.ratings.count + 1,
              }
            : { sum: testimonial.rating, count: 1 },
      });
    });
  });

export const testimonialsUnderActionAdded = functions.firestore
  .document(testimonialsUnderActionPath)
  .onCreate((snapshot, context) => {
    const ids = context.params;
    const store = getFirestore();
    const testimonial = socialProofConverter.fromFirestore(snapshot);
    const ancestorRefs = {
      initiative: store
        .doc(`members/${ids.memberId}/initiatives/${ids.initiativeId}`)
        .withConverter(initiativeConverter),
      action: store
        .doc(
          `members/${ids.memberId}/initiatives/${ids.initiativeId}/actions/${ids.actionId}`
        )
        .withConverter(posiFormDataConverter),
    };
    return store.runTransaction(async (t) => {
      const initiativeDoc = await t.get(ancestorRefs.initiative);
      const actionDoc = await t.get(ancestorRefs.action);
      const initiative = initiativeDoc.data();
      const action = actionDoc.data();
      if (!initiative) {
        throw new Error(`No initiative found for testimonial ${snapshot.id}`);
      }
      if (!action) {
        throw new Error(`No action found for testimonial ${snapshot.id}`);
      }
      t.update(initiativeDoc.ref, {
        ratings:
          initiative.ratings &&
          initiative.ratings.sum &&
          testimonial.rating &&
          initiative.ratings.count
            ? {
                sum: initiative.ratings.sum + testimonial.rating,
                count: initiative.ratings.count + 1,
              }
            : { sum: testimonial.rating, count: 1 },
      }).update(actionDoc.ref, {
        ratings:
          action.ratings &&
          action.ratings.sum &&
          testimonial.rating &&
          action.ratings.count
            ? {
                sum: action.ratings.sum + testimonial.rating,
                count: action.ratings.count + 1,
              }
            : { sum: testimonial.rating, count: 1 },
      });
    });
  });
