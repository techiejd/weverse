import { Dialog, Stack, Typography } from "@mui/material";
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
  open: boolean;
  onClose: () => void;
  emoji: string;
  label: string;
  explanation: string;
  leftSide: SimpleEmojiProps;
  rightSide: SimpleEmojiProps;
}) => (
  <Dialog
    open={props.open}
    onClose={props.onClose}
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

export default ExplainExchangeDialog;
