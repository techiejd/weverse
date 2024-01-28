import { Button, Grid, Stack, Typography } from "@mui/material";
import { useSignOut } from "react-firebase-hooks/auth";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../../common/components/onewePage";
import { useAppState } from "../../../common/context/appState";
import {
  useCurrentInitiatives,
  useCurrentLikes,
  useCurrentTestimonials,
  useIsMine,
  useMyMember,
} from "../../../common/context/weverseUtils";
import { CachePaths } from "../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../common/utils/translations";
import { Sponsorship } from "../../../functions/shared/src";
import InitiativeCard from "../../../modules/initiatives/InitiativeCard";
import Sponsorships from "../../../modules/initiatives/sponsor/list";
import { useCurrentSponsorships } from "../../../modules/members/context";
import SocialProofCard from "../../../modules/posi/socialProofCard";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const UserPage = asOneWePage(() => {
  // TODO(techiejd): Do admin story so that user page can be protected.
  const yourMemberTranslations = useTranslations("members.yours");
  const appState = useAppState();
  const [initiatives, initiativesLoading, initiativesError] =
    useCurrentInitiatives();
  const [testimonials] = useCurrentTestimonials();
  const [likedActionPaths] = useCurrentLikes();

  const [signOut] = useSignOut(appState.auth);
  const [myMember] = useMyMember();
  const isMine = useIsMine();

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
      {isMine && [
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
          (!isMine
            ? undefined
            : async (sponsorship: Sponsorship) => {
                return fetch("/api/sponsor/cancel", {
                  method: "POST",
                  body: JSON.stringify({
                    stripeSubscription: myMember.stripe?.subscription,
                    stripeSubscriptionItem: sponsorship.stripeSubscriptionItem,
                    initiative: sponsorship.initiative,
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
        useCurrentSponsorships={useCurrentSponsorships}
      />
      <Typography variant="h2">
        {yourMemberTranslations("initiatives.title")}
      </Typography>
      {initiativesError && (
        <Typography color={"red"}>
          {JSON.stringify(initiativesError)}
        </Typography>
      )}
      {initiativesLoading && (
        <Typography>
          {yourMemberTranslations("initiatives.initiativesLoading")}
        </Typography>
      )}
      {!initiativesLoading &&
        !initiativesError &&
        initiatives &&
        initiatives.length == 0 && (
          <Typography>{yourMemberTranslations("initiatives.none")}</Typography>
        )}
      {initiatives?.map((i) => (
        <InitiativeCard initiativePath={i.path!} key={i.path!} />
      ))}
      {isMine && (
        <Button variant="contained" href={`/${myMember?.path}/initiatives/add`}>
          Publish a new initiative
        </Button>
      )}
      <Typography variant="h2">Your testimonials</Typography>
      <Grid container spacing={1}>
        {testimonials?.map((t, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={t.ref.path}>
            <SocialProofCard
              socialProof={t.data().data}
              href={
                isMine
                  ? `/${
                      t.data().data.forAction
                        ? t.data().data.forAction
                        : t.data().data.forInitiative
                    }/impact/edit`
                  : undefined
              }
            />
          </Grid>
        ))}
      </Grid>
      <Typography variant="h2">Your liked actions</Typography>
    </Stack>
  );
});

export default UserPage;
