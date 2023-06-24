import { useRouter } from "next/router";
import { useAppState } from "../../common/context/appState";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import MakerCard from "../../modules/makers/MakerCard";
import { useSignOut } from "react-firebase-hooks/auth";
import Sponsorships from "../../modules/makers/sponsor/list";

const UserPage = () => {
  // TODO(techiejd): Do admin story so that user page can be protected.
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
      <Sponsorships showAmount />
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
