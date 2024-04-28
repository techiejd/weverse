import { Stack, Typography } from "@mui/material";
import { asOneWePage } from "../../../../common/components/onewePage";
import { useCurrentMember } from "../../../../common/context/weverseUtils";
import { CachePaths } from "../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../common/utils/translations";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const ContactPage = asOneWePage(() => {
  const [member] = useCurrentMember();

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
      <Typography variant="h1">Contact {member?.name}</Typography>
      <Typography variant="h2">
        Phone: +{member?.phoneNumber.countryCallingCode}{" "}
        {member?.phoneNumber.nationalNumber}
      </Typography>
    </Stack>
  );
});

export default ContactPage;
