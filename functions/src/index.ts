import * as functions from "firebase-functions";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import {
  initiativeConverter,
  posiFormDataConverter,
  socialProofConverter,
} from "./utils";
import { Ratings } from "../shared/lib";

initializeApp();

const shouldAbortFunction = async (store: Firestore) => {
  const doc = await store.collection("settings").doc("functions").get();
  const data = doc.data();
  if (!doc.exists || !data) {
    return true;
  }
  return !data.shouldRunFunctions;
};

const testimonialsUnderInitiativePath =
  "members/{memberId}/initiatives/{initiativeId}/testimonials/{testimonialId}";
const testimonialsUnderActionPath =
  "members/{memberId}/initiatives/{initiativeId}/actions/{actionId}/testimonials/{testimonialId}";

const isIllFormedRatings = (ratings?: Ratings) => {
  return !ratings || ratings.sum == undefined || ratings.count == undefined;
};

export const testimonialUnderInitiativeAdded = functions.firestore
  .document(testimonialsUnderInitiativePath)
  .onCreate(async (snapshot, context) => {
    const store = getFirestore();
    if (await shouldAbortFunction(store)) {
      return Promise.resolve();
    }

    const ids = context.params;
    const testimonial = socialProofConverter.fromFirestore(snapshot);
    const initiativeDocRef = store
      .doc(`members/${ids.memberId}/initiatives/${ids.initiativeId}`)
      .withConverter(initiativeConverter);
    return store.runTransaction(async (t) => {
      const initiativeDoc = await t.get(initiativeDocRef);
      const initiative = initiativeDoc.data();
      if (!initiative) {
        throw new Error(
          `No initiative found for testimonial ${snapshot.ref.path}`
        );
      }
      if (isIllFormedRatings(initiative.ratings)) {
        throw new Error(
          `Ratings ill formed for initiative ${
            initiativeDocRef.path
          }: ${JSON.stringify(initiative.ratings)}`
        );
      }
      if (!testimonial.rating) {
        throw new Error(`Testimonial ${snapshot.ref.path} ill formed`);
      }
      t.update(initiativeDoc.ref, {
        ratings: {
          sum: initiative.ratings!.sum! + testimonial.rating,
          count: initiative.ratings!.count! + 1,
        },
      });
    });
  });

export const testimonialUnderInitiativeDeleted = functions.firestore
  .document(testimonialsUnderInitiativePath)
  .onDelete(async (snapshot, context) => {
    const store = getFirestore();
    if (await shouldAbortFunction(store)) {
      return Promise.resolve();
    }

    const ids = context.params;
    const testimonial = socialProofConverter.fromFirestore(snapshot);
    const initiativeDocRef = store
      .doc(`members/${ids.memberId}/initiatives/${ids.initiativeId}`)
      .withConverter(initiativeConverter);
    return store.runTransaction(async (t) => {
      const initiativeDoc = await t.get(initiativeDocRef);
      const initiative = initiativeDoc.data();
      if (!initiative) {
        throw new Error(
          `No initiative found for testimonial ${snapshot.ref.path}`
        );
      }
      if (isIllFormedRatings(initiative.ratings)) {
        throw new Error(
          `Ratings ill formed for initiative ${
            initiativeDocRef.path
          }: ${JSON.stringify(initiative.ratings)}`
        );
      }
      if (!testimonial.rating) {
        throw new Error(`Testimonial ${snapshot.ref.path} ill formed`);
      }
      t.update(initiativeDoc.ref, {
        ratings: {
          sum: initiative.ratings!.sum! - testimonial.rating,
          count: initiative.ratings!.count! - 1,
        },
      });
    });
  });

export const testimonialUnderInitiativeUpdated = functions.firestore
  .document(testimonialsUnderInitiativePath)
  .onUpdate(async (change, context) => {
    const store = getFirestore();
    if (await shouldAbortFunction(store)) {
      return Promise.resolve();
    }

    const ids = context.params;
    const testimonialBefore = socialProofConverter.fromFirestore(change.before);
    const testimonialAfter = socialProofConverter.fromFirestore(change.after);
    const initiativeDocRef = store
      .doc(`members/${ids.memberId}/initiatives/${ids.initiativeId}`)
      .withConverter(initiativeConverter);
    return store.runTransaction(async (t) => {
      const initiativeDoc = await t.get(initiativeDocRef);
      const initiative = initiativeDoc.data();
      if (!initiative) {
        throw new Error(
          `No initiative found for testimonial ${change.after.ref.path}`
        );
      }
      if (isIllFormedRatings(initiative.ratings)) {
        throw new Error(
          `Ratings ill formed for initiative ${
            initiativeDocRef.path
          }: ${JSON.stringify(initiative.ratings)}`
        );
      }
      if (!testimonialBefore.rating || !testimonialAfter.rating) {
        throw new Error(
          `Testimonial after ${change.after.ref.path} or before ${change.before.ref.path} ill formed`
        );
      }
      t.update(initiativeDoc.ref, {
        "ratings.sum":
          initiative.ratings!.sum! -
          testimonialBefore.rating +
          testimonialAfter.rating,
      });
    });
  });

export const testimonialsUnderActionAdded = functions.firestore
  .document(testimonialsUnderActionPath)
  .onCreate(async (snapshot, context) => {
    const store = getFirestore();
    if (await shouldAbortFunction(store)) {
      return Promise.resolve();
    }

    const ids = context.params;
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
        throw new Error(
          `No initiative found for testimonial ${snapshot.ref.path}`
        );
      }
      if (isIllFormedRatings(initiative.ratings)) {
        throw new Error(
          `Ratings ill formed for initiative ${
            ancestorRefs.initiative.path
          }: ${JSON.stringify(initiative.ratings)}`
        );
      }
      if (!action) {
        throw new Error(`No action found for testimonial ${snapshot.ref.path}`);
      }
      if (isIllFormedRatings(action.ratings)) {
        throw new Error(
          `Ratings ill formed for action ${
            ancestorRefs.action.path
          }: ${JSON.stringify(action.ratings)}`
        );
      }
      if (!testimonial.rating) {
        throw new Error(`Testimonial ${snapshot.ref.path} ill formed`);
      }
      t.update(initiativeDoc.ref, {
        ratings: {
          sum: initiative.ratings!.sum! + testimonial.rating,
          count: initiative.ratings!.count! + 1,
        },
      }).update(actionDoc.ref, {
        ratings: {
          sum: action.ratings!.sum! + testimonial.rating,
          count: action.ratings!.count! + 1,
        },
      });
    });
  });

export const testimonialsUnderActionDeleted = functions.firestore
  .document(testimonialsUnderActionPath)
  .onDelete(async (snapshot, context) => {
    const store = getFirestore();
    if (await shouldAbortFunction(store)) {
      return Promise.resolve();
    }

    const ids = context.params;
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
        throw new Error(
          `No initiative found for testimonial ${snapshot.ref.path}`
        );
      }
      if (isIllFormedRatings(initiative.ratings)) {
        throw new Error(
          `Ratings ill formed for initiative ${
            ancestorRefs.initiative.path
          }: ${JSON.stringify(initiative.ratings)}`
        );
      }
      if (!action) {
        throw new Error(`No action found for testimonial ${snapshot.ref.path}`);
      }
      if (isIllFormedRatings(action.ratings)) {
        throw new Error(
          `Ratings ill formed for action ${
            ancestorRefs.action.path
          }: ${JSON.stringify(action.ratings)}`
        );
      }
      if (!testimonial.rating) {
        throw new Error(`Testimonial ${snapshot.ref.path} ill formed`);
      }
      t.update(initiativeDoc.ref, {
        ratings: {
          sum: initiative.ratings!.sum! - testimonial.rating,
          count: initiative.ratings!.count! - 1,
        },
      }).update(actionDoc.ref, {
        ratings: {
          sum: action.ratings!.sum! - testimonial.rating,
          count: action.ratings!.count! - 1,
        },
      });
    });
  });

export const testimonialsUnderActionUpdated = functions.firestore
  .document(testimonialsUnderActionPath)
  .onUpdate(async (change, context) => {
    const store = getFirestore();
    if (await shouldAbortFunction(store)) {
      return Promise.resolve();
    }

    const ids = context.params;
    const testimonialBefore = socialProofConverter.fromFirestore(change.before);
    const testimonialAfter = socialProofConverter.fromFirestore(change.after);
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
        throw new Error(
          `No initiative found for testimonial ${change.after.ref.path}`
        );
      }
      if (isIllFormedRatings(initiative.ratings)) {
        throw new Error(
          `Ratings ill formed for initiative ${
            ancestorRefs.initiative.path
          }: ${JSON.stringify(initiative.ratings)}`
        );
      }
      if (!action) {
        throw new Error(
          `No action found for testimonial ${change.after.ref.path}`
        );
      }
      if (isIllFormedRatings(action.ratings)) {
        throw new Error(
          `Ratings ill formed for action ${
            ancestorRefs.action.path
          }: ${JSON.stringify(action.ratings)}`
        );
      }
      if (!testimonialBefore.rating || !testimonialAfter.rating) {
        throw new Error(
          `Testimonial after ${change.after.ref.path} or before ${change.before.ref.path} ill formed`
        );
      }
      t.update(initiativeDoc.ref, {
        "ratings.sum":
          initiative.ratings!.sum! -
          testimonialBefore.rating +
          testimonialAfter.rating,
      }).update(actionDoc.ref, {
        "ratings.sum":
          action.ratings!.sum! -
          testimonialBefore.rating +
          testimonialAfter.rating,
      });
    });
  });
