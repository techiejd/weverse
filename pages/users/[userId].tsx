import { useRouter } from "next/router";
import { useAppState } from "../../common/context/appState";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";
import {
  Button,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import MakerCard from "../../modules/makers/MakerCard";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { sponsorshipConverter } from "../../common/utils/firebase";
import { Sponsorship } from "../../functions/shared/src";
import { toCop } from "../../modules/makers/sponsor/common/utils";
import { useMaker, useMyMember } from "../../common/context/weverseUtils";

const SponsorshipDisplay = ({ sponsorship }: { sponsorship: Sponsorship }) => {
  const [maker] = useMaker(sponsorship.maker);
  return (
    <ListItem sx={{ px: 0 }}>
      <ListItemText
        primary={maker?.name ?? "Cargando..."}
        secondary={sponsorship.paymentsStarted!.toLocaleString("es-CO")}
      />
      <Typography variant="body2">{toCop(sponsorship.total)}</Typography>
    </ListItem>
  );
};

const UserPage = () => {
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
  const [signOut, signOutLoading, signOutError] = useSignOut(appState.auth);

  const [sponsorships, sponsorshipsLoading, sponsorshipsError] =
    useCollectionData(
      user
        ? collection(
            appState.firestore,
            "members",
            user.uid,
            "sponsorships"
          ).withConverter(sponsorshipConverter)
        : undefined
    );

  const Sponsorships = () => {
    const [myMember] = useMyMember();
    <Typography variant="h2">Patrocinios:</Typography>;
    const memberPayingSponsorships = !myMember?.stripe?.billingCycleStart;
    const memberHasNoSponsorships =
      !memberPayingSponsorships ||
      (!sponsorshipsLoading &&
        !sponsorshipsError &&
        sponsorships &&
        sponsorships.length == 0);

    return (
      <Fragment>
        {memberPayingSponsorships && sponsorshipsError && (
          <Typography color={"red"}>
            Error: {JSON.stringify(sponsorshipsError)}
          </Typography>
        )}
        {memberPayingSponsorships && sponsorshipsLoading && (
          <Typography>Patrocinios: Cargando...</Typography>
        )}
        {memberHasNoSponsorships && (
          <Typography>No hay patrocinios.</Typography>
        )}
        {memberPayingSponsorships &&
          sponsorships
            ?.filter((sponsorship) => !!sponsorship.paymentsStarted)
            .map((sponsorship) => (
              <SponsorshipDisplay
                sponsorship={sponsorship}
                key={sponsorship.id}
              />
            ))}
      </Fragment>
    );
  };
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
            Usuario:
          </Typography>,
          <Button
            key="disconnect button"
            variant="contained"
            onClick={() => signOut()}
          >
            Desconectar
          </Button>,
        ]}
      <Sponsorships />
      <Typography variant="h2">Los Makers:</Typography>
      {makersError && (
        <Typography color={"red"}>
          Error: {JSON.stringify(makersError)}
        </Typography>
      )}
      {loading && <Typography>Makers: Loading...</Typography>}
      {!loading && !makersError && makerIds.length == 0 && (
        <Typography>No hay maker aquí.</Typography>
      )}
      {makerIds.map((makerId) => (
        <MakerCard makerId={makerId} key={makerId} />
      ))}
    </Stack>
  );
};

export default UserPage;
