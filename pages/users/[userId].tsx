import { useRouter } from "next/router";
import { useAppState } from "../../common/context/appState";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from "@mui/material";
import MakerCard from "../../modules/makers/MakerCard";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { sponsorshipConverter } from "../../common/utils/firebase";
import { Sponsorship } from "../../functions/shared/src";
import {
  sponsorshipLevels,
  toCop,
} from "../../modules/makers/sponsor/common/utils";
import {
  useCurrentSubscriptions,
  useMaker,
  useMember,
  useMyMember,
} from "../../common/context/weverseUtils";
import { Close } from "@mui/icons-material";

const SponsorshipDisplay = ({
  sponsorship,
  type,
  handleDelete,
}: {
  sponsorship: Sponsorship;
  type: "for" | "from";
  handleDelete?: () => Promise<any>;
}) => {
  const [maker] = useMaker(type == "for" ? sponsorship.maker : undefined);
  const [member] = useMember(type == "from" ? sponsorship.member : undefined);
  const [loading, setLoading] = useState(false);
  console.log("yo: ", {
    maker,
    member,
    type,
    sponsorship,
    for: type == "for" ? sponsorship.maker : undefined,
    from: type == "from" ? sponsorship.member : undefined,
  });
  const displayInfo =
    type == "for"
      ? {
          name: maker?.name,
          pic: maker?.pic,
        }
      : {
          name: member?.name,
          pic: member?.pic,
        };
  const dateStarted = new Intl.DateTimeFormat("es-CO").format(
    sponsorship.paymentsStarted!
  );
  const amount = toCop(sponsorship.total);

  return (
    <ListItem>
      {type == "for" && handleDelete && (
        <ListItemIcon>
          <IconButton
            onClick={async () => {
              setLoading(true);
              await handleDelete();
              setLoading(false);
            }}
          >
            <Close />
          </IconButton>
        </ListItemIcon>
      )}
      <ListItemText
        primary={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={displayInfo.pic}
              sx={{ width: 25, height: 25, mr: 1 }}
            />
            {displayInfo.name}
          </Stack>
        }
        secondary={
          <>
            {dateStarted}{" "}
            {!!amount && (
              <>
                <br />
                {amount}
              </>
            )}
          </>
        }
        secondaryTypographyProps={{ fontSize: 12 }}
      />
      <Typography variant="body2">
        {sponsorshipLevels[sponsorship.sponsorshipLevel].displayName}
      </Typography>
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
    useCurrentSubscriptions();

  const Sponsorships = () => {
    const [myMember] = useMyMember();
    <Typography variant="h2">Patrocinios:</Typography>;
    const memberPayingSponsorships = myMember?.stripe?.status == "active";
    const memberHasNoSponsorships =
      !memberPayingSponsorships ||
      (!sponsorshipsLoading &&
        !sponsorshipsError &&
        sponsorships &&
        sponsorships.length == 0);

    return (
      <Fragment>
        <Typography variant="h2">Patrocinios:</Typography>
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
          sponsorships &&
          sponsorships?.length > 0 && (
            <List
              subheader={
                <ListSubheader>
                  Ciclo de facturación iniciado:{" "}
                  {new Intl.DateTimeFormat("es-CO").format(
                    myMember?.stripe?.billingCycleAnchor
                  )}
                </ListSubheader>
              }
              sx={{
                border: 1,
                p: 2,
                m: 2,
                backgroundColor: "#f5f8ff",
                borderRadius: 2,
                borderColor: "#d9e1ec",
                width: "100%",
                maxWidth: 500,
              }}
            >
              {sponsorships
                ?.filter((sponsorship) => !!sponsorship.paymentsStarted)
                .map((sponsorship) => (
                  <SponsorshipDisplay
                    type="for"
                    sponsorship={sponsorship}
                    key={sponsorship.id}
                    handleDelete={async () => {
                      return fetch("/api/sponsor/cancel");
                    }}
                  />
                ))}
            </List>
          )}
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
