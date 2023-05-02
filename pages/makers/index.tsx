import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { AppState, useAppState } from "../../common/context/appState";
import {
  Box,
  CircularProgress,
  Fab,
  Link,
  SpeedDial,
  SpeedDialAction,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import MakerCard from "../../modules/makers/MakerCard";
import {
  Maker,
  makerConverter,
  memberConverter,
} from "../../common/context/weverse";
import PageTitle from "../../common/components/pageTitle";
import { Edit, Pending, PlusOne, Share, Visibility } from "@mui/icons-material";
import AuthDialog from "../../modules/auth/AuthDialog";
import { useAuthState } from "react-firebase-hooks/auth";
import SharingSpeedDialAction from "../../modules/posi/sharingSpeedDialAction";
import { User } from "firebase/auth";
import { doc } from "firebase/firestore";

const loadingFab = (
  <Fab
    variant="extended"
    sx={{
      position: "fixed",
      bottom: 16,
      right: 16,
    }}
    color="primary"
  >
    <Pending sx={{ mr: 1 }} />
    <Typography>Loading</Typography>
  </Fab>
);

const makerFab = (maker: Maker) => {
  const actions = [
    <SpeedDialAction
      key="Ver"
      icon={
        <Link href={`/makers/${maker.id}`} style={{ textDecoration: "none" }}>
          <Visibility />
        </Link>
      }
      tooltipTitle={
        <Link href={`/makers/${maker.id}`} style={{ textDecoration: "none" }}>
          Ver
        </Link>
      }
      tooltipOpen
    />,
    <SpeedDialAction
      key={"Editar"}
      icon={
        <Link
          href={`/makers/${maker.id}/edit`}
          style={{ textDecoration: "none" }}
        >
          <Edit />
        </Link>
      }
      tooltipTitle={
        <Link
          href={`/makers/${maker.id}/edit`}
          style={{ textDecoration: "none" }}
        >
          Editar
        </Link>
      }
      tooltipOpen
    />,
    <SharingSpeedDialAction
      key={"Compartir"}
      icon={<Share />}
      tooltipTitle={"Compartir"}
      tooltipOpen
      title={`Maker: `}
      text={`Maker: `}
      url={``}
    />,
  ];
  return (
    <SpeedDial
      ariaLabel="Support"
      sx={{
        position: "fixed",
        bottom: 64,
        right: 16,
      }}
      icon={
        <div>
          <Typography fontSize={22}>💪</Typography>
          <Typography fontSize={10}>Mio</Typography>
        </div>
      }
    >
      {actions}
    </SpeedDial>
  );
};

const MyMakerSpeedDial = ({
  user,
  appState,
}: {
  user: User;
  appState: AppState;
}) => {
  const MyMakerSpeedDialContent = ({ makerId }: { makerId: string }) => {
    const makerDocRef = doc(
      appState.firestore,
      "makers",
      makerId
    ).withConverter(makerConverter);
    const [maker, makerLoading, makerError] = useDocumentData(makerDocRef);
    console.log(maker);
    return maker ? makerFab(maker) : loadingFab;
  };
  const memberDocRef = doc(
    appState.firestore,
    "members",
    user.uid
  ).withConverter(memberConverter);
  const [member, memberLoading, memberError] = useDocumentData(memberDocRef);

  return member ? (
    <MyMakerSpeedDialContent makerId={member.makerId} />
  ) : (
    loadingFab
  );
};

const MyMakerPortal = ({ appState }: { appState: AppState }) => {
  const [user, userLoading, userError] = useAuthState(appState.auth);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const registerFab = (
    <Fab
      variant="extended"
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
      }}
      color="primary"
      onClick={() => {
        setAuthDialogOpen(true);
      }}
    >
      <PlusOne sx={{ mr: 1 }} />
      <Typography>¡Sumáte!</Typography>
    </Fab>
  );

  return (
    <Box>
      <AuthDialog open={authDialogOpen} setOpen={setAuthDialogOpen} />
      {userLoading ? (
        loadingFab
      ) : user ? (
        <MyMakerSpeedDial user={user} appState={appState} />
      ) : (
        registerFab
      )}
    </Box>
  );
};

const MakersListed = ({ appState }: { appState: AppState }) => {
  const [makersSnapshot, makersLoading, makersError] = useCollection(
    collection(appState.firestore, "makers").withConverter(makerConverter)
  );

  const [makers, setMakers] = useState<string[]>([]);

  const Loading = () => {
    return (
      <Box>
        <Typography>Makers: Loading...</Typography>
        <CircularProgress />
      </Box>
    );
  };

  useEffect(() => {
    makersSnapshot?.docChanges().forEach((docChange) => {
      // TODO(techiejd): Look into the other scenarios.
      if (docChange.type == "added") {
        setMakers((makers) => [...makers, docChange.doc.id]);
      }
    });
  }, [makersSnapshot]);
  return (
    <Box>
      <Stack
        sx={{ alignItems: "center", justifyContent: "center", p: 1 }}
        spacing={1}
      >
        <PageTitle title={<b>💪 Makers</b>} />
        {makersError && (
          <Typography color={"red"}>
            Error: {JSON.stringify(makersError)}
          </Typography>
        )}
        {makersLoading && <Loading />}
        {makers.map((maker) => (
          <MakerCard makerId={maker} key={maker} />
        ))}
      </Stack>
      <MyMakerPortal appState={appState} />
    </Box>
  );
};

const Makers = () => {
  const appState = useAppState();
  return appState ? <MakersListed appState={appState} /> : <CircularProgress />;
};

export default Makers;
