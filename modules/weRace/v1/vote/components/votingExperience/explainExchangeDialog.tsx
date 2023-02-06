import { Dialog, Stack, Typography } from "@mui/material";
import { useState } from "react";
export type SimpleEmojiProps = { emoji: string; label: string };

export const SimpleEmojiLabel = (props: SimpleEmojiProps) => {
  return (
    <Stack
      sx={{
        alignItems: "center",
      }}
    >
      <Typography>{props.emoji}</Typography>
      <Typography>{props.label}</Typography>
    </Stack>
  );
};

const ExplainExchangeDialog = (props: {
  emoji: string;
  label: string;
  explanation: string;
  leftSide: SimpleEmojiProps;
  rightSide: SimpleEmojiProps;
}) => {
  const [isExplanationOpened, setIsExplanationOpened] = useState(true);
  const closeExplanation = () => setIsExplanationOpened(false);
  return (
    <Dialog
      open={isExplanationOpened}
      onClose={closeExplanation}
      PaperProps={{
        style: {
          backgroundColor: "purple",
          borderRadius: 4,
        },
      }}
    >
      <Stack
        sx={{
          width: "248px",
          height: "343px",
          alignItems: "center",
          justifyContent: "space-around",
          p: 1,
        }}
      >
        <Typography>{props.emoji}</Typography>
        <Typography>{props.label}</Typography>
        <Typography textAlign={"center"}>{props.explanation}</Typography>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            backgroundColor: "brown",
            alignItems: "center",
          }}
        >
          <SimpleEmojiLabel {...props.leftSide} />
          <Typography>=</Typography>
          <SimpleEmojiLabel {...props.rightSide} />
        </Stack>
        <Typography>CONTINUE</Typography>
      </Stack>
    </Dialog>
  );
};

export default ExplainExchangeDialog;
