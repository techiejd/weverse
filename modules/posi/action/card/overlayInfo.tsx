import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import FmdGood from "@mui/icons-material/FmdGood";
import {
  Stack,
  Typography,
  CircularProgress,
  LinearProgress,
  Avatar,
} from "@mui/material";
import { writeBatch, doc } from "firebase/firestore";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { useAppState } from "../../../../common/context/appState";
import {
  useInitiativeTypeLabel,
  useLikesCount,
  useInitiative,
  useMyLikes,
  useMyMember,
} from "../../../../common/context/weverseUtils";
import { useLikeConverter } from "../../../../common/utils/firebase";
import { PosiFormData } from "../../../../functions/shared/src";

const transaparentPillBox = {
  minHeight: "33px",
  backgroundColor: "rgba(2, 13, 14,0.3)",
  borderRadius: 5,
  alignItems: "center",
  pl: 1,
  pr: 1,
};

const LikesDisplay = ({
  action,
  setLogInPromptOpen,
}: {
  action: PosiFormData;
  setLogInPromptOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const appState = useAppState();
  const [myMember, myMemberLoading, myMemberError] = useMyMember();
  const likes = useLikesCount(action.id);
  const [localChange, setLocalChange] = useState<
    "increment" | "decrement" | undefined
  >();
  const [updating, setUpdating] = useState(false);
  const localLikes =
    likes +
    (localChange == undefined ? 0 : localChange == "increment" ? 1 : -1);
  const myLikes = useMyLikes();
  const liked = myLikes.includes(String(action.id));
  const likeConverter = useLikeConverter();
  const updateLikes = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (updating || action.id == undefined || myMember?.id == undefined) {
      if (myMember?.id == undefined) {
        setLogInPromptOpen(true);
      }
      return;
    }
    const batch = writeBatch(appState.firestore);
    const actionLikeDoc = doc(
      appState.firestore,
      "impacts",
      action.id,
      "likes",
      myMember.id
    ).withConverter(likeConverter);
    const memberLikeDoc = doc(
      appState.firestore,
      "members",
      myMember.id,
      "likes",
      action.id
    ).withConverter(likeConverter);
    const commit = async () => {
      setUpdating(true);
      await batch.commit();
      setUpdating(false);
    };
    const increment = async () => {
      batch.set(actionLikeDoc, {});
      batch.set(memberLikeDoc, {});
      await commit();
    };
    const decrement = async () => {
      batch.delete(actionLikeDoc);
      batch.delete(memberLikeDoc);
      await commit();
    };
    switch (localChange) {
      case "increment": {
        await decrement();
        setLocalChange(undefined);
        break;
      }
      case "decrement": {
        await increment();
        setLocalChange(undefined);
        break;
      }
      default: {
        if (liked) {
          await decrement();
          setLocalChange("decrement");
        } else {
          await increment();
          setLocalChange("increment");
        }
        break;
      }
    }
  };
  return (
    <Stack
      direction="row"
      sx={[transaparentPillBox, { color: "white", maxHeight: "33px" }]}
      width="fit-content"
      spacing={1}
      onClick={(e) => updateLikes(e)}
    >
      {((!localChange && liked) || localChange == "increment") && (
        <Favorite sx={{ color: "red" }} />
      )}
      {((!localChange && !liked) || localChange == "decrement") && (
        <FavoriteBorder />
      )}
      <Typography>{updating ? <CircularProgress /> : localLikes}</Typography>
    </Stack>
  );
};

const OverlayInfo = ({
  action,
  setLogInPromptOpen,
}: {
  action: PosiFormData;
  setLogInPromptOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [initiative] = useInitiative(action.initiativeId);
  const initiativeTypeLabel = useInitiativeTypeLabel(initiative);

  return (
    <Stack
      sx={{
        backgroundColor: "transparent",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        pt: 3,
        pl: 1,
        pr: 1,
        pb: 2,
      }}
    >
      <Stack
        sx={[transaparentPillBox, { width: "fit-content" }]}
        direction={"row"}
        spacing={1}
      >
        <Avatar
          key="initiativeAvatorOnActionCard"
          src={initiative?.pic}
          sx={{ width: 25, height: 25, mr: 1 }}
        />
        {initiative ? (
          [
            <Typography
              key="initiativeTitleOnActionCard"
              fontWeight={"bold"}
              color={"white"}
            >
              {initiative.name}
            </Typography>,
            <Typography
              key="initiativeTypeOnActionCard"
              sx={{
                backgroundColor: "#d6ffcc",
                borderRadius: 5,
                height: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
              }}
            >
              {initiativeTypeLabel}
            </Typography>,
          ]
        ) : (
          <LinearProgress key="initiativeLinearProgressOnActionCard" />
        )}
      </Stack>
      <Stack
        direction="row-reverse"
        justifyContent="space-between"
        alignItems="end"
      >
        <LikesDisplay action={action} setLogInPromptOpen={setLogInPromptOpen} />
        {action.location?.structuredFormatting?.mainText ? (
          <Typography
            sx={{
              backgroundColor: "white",
              borderRadius: 5,
              minHeight: 23,
              width: "fit-content",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
            }}
          >
            <FmdGood />
            {action.location.structuredFormatting.mainText}
          </Typography>
        ) : (
          <></>
        )}
      </Stack>
    </Stack>
  );
};

export default OverlayInfo;
