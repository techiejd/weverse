import { initializeApp } from 'firebase/app';
import {
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  serverTimestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { Maker, maker, SocialProof, socialProof, Member, member, PosiFormData, posiFormData, Like, like } from '../../functions/shared/src';

export const creds = {
  apiKey: String(process.env.NEXT_PUBLIC_REACT_APP_API_KEY),
  authDomain: String(process.env.NEXT_PUBLIC_REACT_APP_AUTH_DOMAIN),
  projectId: String(process.env.NEXT_PUBLIC_REACT_APP_PROJECT_ID),
  storageBucket: String(process.env.NEXT_PUBLIC_REACT_APP_STORAGE_BUCKET),
  messagingSenderId: String(process.env.NEXT_PUBLIC_REACT_APP_MESSAGING_SENDER_ID),
  appId: String(process.env.NEXT_PUBLIC_REACT_APP_ID),
  measurementId: String(process.env.NEXT_PUBLIC_REACT_APP_MEASUREMENT_ID),
};

export const app = initializeApp(creds);

export const makerConverter: FirestoreDataConverter<Maker> = {
  toFirestore(maker: WithFieldValue<Maker>): DocumentData {
    const {id, ...others} = maker;
    return {
      ...others,
      createdAt: maker.createdAt ? maker.createdAt : serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Maker {
    const data = snapshot.data();
    // anything with serverTimestamp does not exist atm if pending writes.
    return maker.parse({
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt ? data.createdAt.toDate() : undefined,
    });
  },
};

export const socialProofConverter: FirestoreDataConverter<SocialProof> = {
  toFirestore: (socialProof: WithFieldValue<SocialProof>): DocumentData => {
    const {id, ...others} = socialProof;
    return {
      ...others,
      createdAt: socialProof.createdAt ?
        socialProof.createdAt :
        serverTimestamp(),
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): SocialProof => {
    const {createdAt, ...others} = snapshot.data();
    // anything with serverTimestamp does not exist atm if pending writes.
    return socialProof.parse({
      ...others,
      id: snapshot.id,
      createdAt: createdAt ? createdAt.toDate() : undefined,
    });
  },
};

export const memberConverter: FirestoreDataConverter<Member> = {
  toFirestore: (member: WithFieldValue<Member>): DocumentData => {
    const {id, ...others} = member;
    return {
      ...others,
      createdAt: member.createdAt ? member.createdAt : serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Member {
    const {createdAt, ...others} = snapshot.data();
    // anything with serverTimestamp does not exist atm if pending writes.
    return member.parse({
      ...others,
      id: snapshot.id,
      createdAt: createdAt ? createdAt.toDate() : undefined,
    });
  },
};

export const posiFormDataConverter: FirestoreDataConverter<PosiFormData> = {
  toFirestore: (posiFormData: WithFieldValue<PosiFormData>): DocumentData => {
    const {id, ...others} = posiFormData;
    return {
      ...others,
      createdAt: posiFormData.createdAt ?
        posiFormData.createdAt :
        serverTimestamp(),
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): PosiFormData => {
    const data = snapshot.data();
    return posiFormData.parse({
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt.toDate(),
    });
  },
};

export const likeConverter: FirestoreDataConverter<Like> = {
  toFirestore: (likeData: WithFieldValue<Like>): DocumentData => {
    const {id, ...others} = likeData;
    return {
      ...others,
      createdAt: likeData.createdAt ?
      likeData.createdAt :
        serverTimestamp(),
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): Like => {
    const data = snapshot.data();
    return like.parse({
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt.toDate(),
    });
  },
};