import * as functions from "firebase-functions";
import { Initiative, PosiFormData } from "../shared";
import { DocumentReference, getFirestore } from "firebase-admin/firestore";
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

const ParentDocRef = (r: DocumentReference | null) =>
  r ? r.parent.parent : null;

export const testimonialUnderInitiativeAdded = functions.firestore
  .document(testimonialsUnderInitiativePath)
  .onCreate((snapshot) => {
    const store = getFirestore();
    const testimonial = socialProofConverter.fromFirestore(snapshot);
    const initiativeDocRef = (() => {
      const initiative = ParentDocRef(snapshot.ref)?.withConverter(
        initiativeConverter
      );
      if (!initiative) {
        throw new Error(`No initiative found for testimonial ${snapshot.id}`);
      }
      return initiative;
    })();
    store.runTransaction(async (t) => {
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
  .onCreate((snapshot) => {
    const store = getFirestore();
    const testimonial = socialProofConverter.fromFirestore(snapshot);
    const ancestorRefs = (() => {
      const initiative = ParentDocRef(
        ParentDocRef(snapshot.ref)
      )?.withConverter(initiativeConverter);
      if (!initiative) {
        throw new Error(`No initiative found for testimonial ${snapshot.id}`);
      }
      const action = ParentDocRef(initiative)?.withConverter(
        posiFormDataConverter
      );
      if (!action) {
        throw new Error(`No action found for testimonial ${snapshot.id}`);
      }
      return [initiative, action];
    })();
    store.runTransaction(async (t) => {
      const initiativeDoc = await t.get(
        ancestorRefs[0] as DocumentReference<Initiative>
      );
      const actionDoc =
        ancestorRefs.length > 1
          ? await t.get(ancestorRefs[1] as DocumentReference<PosiFormData>)
          : null;
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
      const action = actionDoc?.data();
      if (!action) {
        throw new Error(`No action found for testimonial ${snapshot.id}`);
      }
      t.update(actionDoc!.ref, {
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
