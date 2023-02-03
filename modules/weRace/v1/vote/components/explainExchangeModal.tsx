import { Stack, Typography } from "@mui/material";
export type SimpleEmojiProps = { emoji: string; label: string };

const SimpleEmojiLabel = (props: SimpleEmojiProps) => {
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

export const ExplainExchangeModal = (props: {
  emoji: string;
  label: string;
  explanation: string;
  leftSide: SimpleEmojiProps;
  rightSide: SimpleEmojiProps;
}) => {
  return (
    <Stack
      sx={{
        backgroundColor: "purple",
        width: "248px",
        height: "343px",
        alignItems: "center",
        borderRadius: 4,
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
  );
};
