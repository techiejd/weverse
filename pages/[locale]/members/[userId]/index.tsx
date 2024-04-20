import {
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../../../common/components/onewePage";
import {
  fromCollectionId2PathAndType,
  useAction,
  useCurrentInitiatives,
  useCurrentLikes,
  useCurrentTestimonials,
  useIsMine,
  useMyMember,
} from "../../../../common/context/weverseUtils";
import { CachePaths } from "../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../common/utils/translations";
import { Sponsorship } from "../../../../functions/shared/src";
import InitiativeCard from "../../../../modules/initiatives/InitiativeCard";
import Sponsorships from "../../../../modules/initiatives/sponsor/list";
import { useCurrentSponsorships } from "../../../../modules/members/context";
import SocialProofCard from "../../../../modules/posi/socialProofCard";
import ImpactCard from "../../../../modules/posi/action/card";
import { useSignOut } from "react-firebase-hooks/auth";
import { useAppState } from "../../../../common/context/appState";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const ImpactCardWrapper = ({ path }: { path: string }) => {
  const [posi] = useAction(path);
  return posi ? <ImpactCard posiData={posi} /> : <CircularProgress />;
};

const UserPage = asOneWePage(() => {
  const appState = useAppState();
  // TODO(techiejd): Do admin story so that user page can be protected.
  const yourMemberTranslations = useTranslations("members.yours");
  const [initiatives, initiativesLoading, initiativesError] =
    useCurrentInitiatives();
  const [testimonials] = useCurrentTestimonials();
  const [likedPaths] = useCurrentLikes();

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
                  //TODO(techiejd): Fix cancelling a sponsorship.
                  method: "POST",
                  body: JSON.stringify({
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
        <Typography>{yourMemberTranslations("initiatives.loading")}</Typography>
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
                  ? `/${fromCollectionId2PathAndType(t.id)!.path}/edit`
                  : undefined
              }
            />
          </Grid>
        ))}
      </Grid>
      <Typography variant="h2">Your liked actions</Typography>
      <Grid container spacing={1}>
        {likedPaths
          ?.filter((l) => l.includes("action"))
          ?.map((l, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={l}>
              <ImpactCardWrapper path={l} />
            </Grid>
          ))}
      </Grid>
    </Stack>
  );
});

export default UserPage;
