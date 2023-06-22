import { Box } from "@mui/material";

const Confirm = ({
  sponsorForm,
  handleBack,
}: {
  sponsorForm: Record<string, string>;
  finishedButtonBehavior: { href: string } | { onClick: () => void };
  handleBack: () => void;
}) => {
  return <Box>Confirm</Box>;
};

export default Confirm;
