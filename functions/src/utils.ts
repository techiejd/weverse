import {FirestoreDataConverter, WithFieldValue,
  DocumentData, QueryDocumentSnapshot} from "firebase-admin/firestore";
import {Maker, maker, SocialProof,
  socialProof, Member, member,
  PosiFormData, posiFormData} from "shared";


export const makerConverter: FirestoreDataConverter<Maker> = {
  toFirestore(maker: WithFieldValue<Maker>): DocumentData {
    const {id, ...others} = maker;
    return {
      ...others,
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
