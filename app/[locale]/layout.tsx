"use client;";
import Header from "./header";
import "./global.css";
import { unstable_setRequestLocale } from "next-intl/server";
import { locale, Member, DbBase, member } from "../../functions/shared/src";
import { AppStateProvider } from "./appState";
import dynamic from "next/dynamic";
import { cookies, headers } from "next/headers";
import {
  getAdminFirestore,
  verifyCookie,
} from "../../common/utils/firebaseAdmin";
import { cache } from "react";
const DynamicDrawer = dynamic(() => import("./drawer"), {
  ssr: false,
});
import { z } from "zod";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
} from "firebase-admin/firestore";
import { redirect } from "next/navigation";

namespace Utils {
  //TODO(techiejd): This is a hack to get around sharing the same schema between nextjs and firebase functions.
  const makeDataConverter = <T extends z.ZodType<DbBase>>(
    zAny: T
  ): FirestoreDataConverter<z.infer<typeof zAny>> => ({
    toFirestore: (data: WithFieldValue<z.infer<typeof zAny>>): DocumentData => {
      const { createdAt, ...others } = data;
      return { ...others, createdAt: createdAt ? createdAt : Timestamp.now() };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): z.infer<typeof zAny> => {
      const data = snapshot.data();
      // anything with serverTimestamp does not exist atm if pending writes.
      return zAny.parse({
        ...data,
        path: snapshot.ref.path,
      });
    },
  });

  export const memberConverter = makeDataConverter(member);
}

export function generateStaticParams() {
  return Object.values(locale.Values).map((locale) => ({ locale }));
}

const getMemberCached = cache(async (uid: string) => {
  const firestore = getAdminFirestore();
  const member = await firestore
    .collection("members")
    .withConverter(Utils.memberConverter)
    .doc(uid)
    .get();
  return member.data() as Member;
});

const getMember = async (): Promise<undefined | Member> => {
  const token = cookies().get("token");
  if (!token) return undefined;
  const authenticatedUser = await verifyCookie(token.value);
  if (!authenticatedUser.authenticated) return undefined;
  return getMemberCached(authenticatedUser.uid);
};

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const member = await getMember();
  if (member && member.locale && member.locale != locale) {
    const headersList = headers();
    const pathName = headersList.get("x-pathname");
    if (!pathName) throw new Error("No pathname found in headers");
    redirect(`/${member.locale}/${pathName.slice(4)}`);
  }
  return (
    <html>
      <body>
        <AppStateProvider member={member}>
          <Header />
          <DynamicDrawer />
          <main>{children}</main>
        </AppStateProvider>
      </body>
    </html>
  );
}
