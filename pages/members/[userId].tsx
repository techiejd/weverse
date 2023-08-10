import { useRouter } from "next/router";
import { useAppState } from "../../common/context/appState";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import MakerCard from "../../modules/makers/MakerCard";
import { useSignOut } from "react-firebase-hooks/auth";
import Sponsorships from "../../modules/makers/sponsor/list";
import { Sponsorship } from "../../functions/shared/src";
import { useMyMember } from "../../common/context/weverseUtils";
import { WithTranslationsStaticProps } from "../../common/utils/translations";
import { CachePaths } from "../../common/utils/staticPaths";
import { asOneWePage } from "../../common/components/onewePage";
import { useTranslations } from "next-intl";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const UserPage = asOneWePage(() => {
  // TODO(techiejd): Do admin story so that user page can be protected.
  const yourMemberTranslations = useTranslations("members.yours");
  const router = useRouter();
  const appState = useAppState();
  const userId = (() => {
    const { userId } = router.query;
    return String(userId);
  })();
  const q = query(
    collection(appState.firestore, "makers"),
    where("ownerId", "==", userId)
  );
  const [makersSnapshot, loading, makersError] = useCollection(q);
  const [makerIds, setMakerIds] = useState<string[]>([]);
  useEffect(() => {
    makersSnapshot?.forEach((makerDocSnapshot) =>
      setMakerIds((makerIds) => [...makerIds, makerDocSnapshot.id])
    );
  }, [makersSnapshot, setMakerIds]);

  const { user } = appState.authState;
  const [signOut] = useSignOut(appState.auth);
  const [myMember] = useMyMember();

  return (
    <Stack
      sx={{
        alignItems: "center",
        justifyContent: "center",
        p: 1,
        width: "100%",
      }}
      spacing={1}
    >
      {user &&
        userId == user.uid && [
          <Typography key="user title" variant="h2">
            {yourMemberTranslations("title")}
          </Typography>,
          <Button
            key="disconnect button"
            variant="contained"
            onClick={() => signOut()}
          >
            {yourMemberTranslations("signOut")}
          </Button>,
        ]}
      <Sponsorships
        showAmount
        handleCancelSponsorship={
          myMember &&
          (myMember.id != userId
            ? undefined
            : async (sponsorship: Sponsorship) => {
                return fetch("/api/sponsor/cancel", {
                  method: "POST",
                  body: JSON.stringify({
                    stripeSubscription: myMember.stripe?.subscription,
                    stripeSubscriptionItem: sponsorship.stripeSubscriptionItem,
                    maker: sponsorship.maker,
                    member: sponsorship.member,
                  }),
                }).then((res) => {
                  if (res.status != 200) {
                    alert(
                      yourMemberTranslations("failedToCancelSponsorship", {
                        error: res.statusText,
                      })
                    );
                  }
                });
              })
        }
      />
      <Typography variant="h2">
        {yourMemberTranslations("makers.title")}
      </Typography>
      {makersError && (
        <Typography color={"red"}>{JSON.stringify(makersError)}</Typography>
      )}
      {loading && (
        <Typography>{yourMemberTranslations("makers.loading")}</Typography>
      )}
      {!loading && !makersError && makerIds.length == 0 && (
        <Typography>{yourMemberTranslations("makers.none")}</Typography>
      )}
      {makerIds.map((makerId) => (
        <MakerCard makerId={makerId} key={makerId} />
      ))}
    </Stack>
  );
});

export default UserPage;
