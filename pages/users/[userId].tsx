import { useRouter } from "next/router";
import { AppState, useAppState } from "../../common/context/appState";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import MakerCard from "../../modules/makers/MakerCard";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";

const UserPage = () => {
  const router = useRouter();
  const appState = useAppState();
  const userId = (() => {
    const { userId } = router.query;
    return String(userId);
  })();
  const UserPageContent = ({ appState }: { appState: AppState }) => {
    const q = query(
      collection(appState.firestore, "makers"),
      where("ownerId", "==", userId)
    );
    const [makersSnapshot, loading, error] = useCollection(q);
    const [makerIds, setMakerIds] = useState<string[]>([]);
    useEffect(() => {
      makersSnapshot?.forEach((makerDocSnapshot) =>
        setMakerIds((makerIds) => [...makerIds, makerDocSnapshot.id])
      );
    }, [makersSnapshot, setMakerIds]);

    const [myUser, myUserLoading, myUserError] = useAuthState(appState.auth);
    const [signOut, signOutLoading, signOutError] = useSignOut(appState.auth);

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
        {myUser &&
          userId == myUser.uid && [
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
        <Typography variant="h2">Los Makers:</Typography>
        {error && (
          <Typography color={"red"}>Error: {JSON.stringify(error)}</Typography>
        )}
        {loading && <Typography>Makers: Loading...</Typography>}
        {!loading && !error && makerIds.length == 0 && (
          <Typography>No hay maker aquí.</Typography>
        )}
        {makerIds.map((makerId) => (
          <MakerCard makerId={makerId} key={makerId} />
        ))}
      </Stack>
    );
  };

  return appState ? (
    <UserPageContent appState={appState} />
  ) : (
    <CircularProgress />
  );
};

export default UserPage;
