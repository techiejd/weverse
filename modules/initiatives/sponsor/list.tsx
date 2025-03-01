import Close from "@mui/icons-material/Close";
import {
  ListItem,
  ListItemIcon,
  IconButton,
  ListItemText,
  Stack,
  Avatar,
  Typography,
  List,
  CircularProgress,
} from "@mui/material";
import { useState, Fragment } from "react";
import {
  useInitiative,
  useMember,
  useCurrentMember,
} from "../../../common/context/weverseUtils";
import { Sponsorship } from "../../../functions/shared/src";
import { feePercentage, toDisplayCurrency, paymentInfo } from "./common/utils";
import { useTranslations } from "next-intl";
import { sectionStyles } from "../../../common/components/theme";
import { useAppState } from "../../../common/context/appState";
import { FirestoreError } from "firebase/firestore";

function useLocalizedDateFormat() {
  const appState = useAppState();
  const locale = appState.languages.primary;
  return new Intl.DateTimeFormat(locale).format;
}

const SponsorshipDisplay = ({
  sponsorship,
  type,
  handleCancelSponsorship,
  showAmount,
}: {
  sponsorship: Sponsorship;
  type: "for" | "from";
  handleCancelSponsorship?: (sponsorship: Sponsorship) => Promise<any>;
  showAmount?: boolean;
}) => {
  const localizedDateFormat = useLocalizedDateFormat();
  const sponsorTranslations = useTranslations("common.sponsor");
  const [initiative] = useInitiative(
    type == "for" ? sponsorship.initiative : undefined
  );
  const [member] = useMember(type == "from" ? sponsorship.member : undefined);
  const [loading, setLoading] = useState(false);
  const displayInfo =
    type == "for"
      ? {
          name: initiative?.name,
          pic: initiative?.pic,
        }
      : {
          name: member?.name,
          pic: member?.pic,
        };
  const dateStarted = localizedDateFormat(sponsorship.paymentsStarted!);
  const amountReceivedFromMember =
    type == "for"
      ? undefined
      : (() => {
          const feeCharge = paymentInfo[sponsorship.currency].feeCharge.amount;
          const tipPercent = sponsorship.tipPercentage / 100;
          const amountReceivedFromMemberIfFeePaidByMember =
            (sponsorship.total - feeCharge) / (1 + tipPercent + feePercentage);
          const amountReceivedFromMemberIfFeePaidByInitiative =
            (sponsorship.total - feeCharge - feeCharge * tipPercent) /
            (1 + tipPercent + feePercentage + tipPercent * feePercentage);
          return sponsorship.denyStripeFee
            ? amountReceivedFromMemberIfFeePaidByInitiative
            : amountReceivedFromMemberIfFeePaidByMember;
        })();
  const amount = showAmount
    ? amountReceivedFromMember
      ? toDisplayCurrency[sponsorship.currency](amountReceivedFromMember)
      : toDisplayCurrency[sponsorship.currency](sponsorship.total)
    : "";

  return (
    <ListItem>
      {type == "for" &&
        handleCancelSponsorship &&
        (loading ? (
          <CircularProgress />
        ) : (
          <ListItemIcon>
            <IconButton
              onClick={async () => {
                setLoading(true);
                await handleCancelSponsorship(sponsorship);
                setLoading(false);
              }}
            >
              <Close />
            </IconButton>
          </ListItemIcon>
        ))}
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
    </ListItem>
  );
};

const Sponsorships = ({
  handleCancelSponsorship,
  showAmount,
  useCurrentSponsorships,
}: {
  handleCancelSponsorship?: (sponsorship: Sponsorship) => Promise<any>;
  showAmount?: boolean;
  useCurrentSponsorships: () => readonly [
    Sponsorship[] | undefined,
    boolean,
    FirestoreError | undefined
  ];
}) => {
  const sponsorshipsTranslations = useTranslations("initiatives.sponsorships");
  const [sponsorships, sponsorshipsLoading, sponsorshipsError] =
    useCurrentSponsorships();
  const [myMember] = useCurrentMember();

  const activeSponsorships = sponsorships?.filter(
    (sponsorship) => !!sponsorship.paymentsStarted
  );
  const noSponsorships =
    !sponsorshipsLoading &&
    !sponsorshipsError &&
    activeSponsorships &&
    activeSponsorships.length == 0;
  return (
    <Fragment>
      <Typography variant="h2">{sponsorshipsTranslations("list")}</Typography>
      {sponsorshipsError && (
        <Typography color={"red"}>
          Error: {JSON.stringify(sponsorshipsError)}
        </Typography>
      )}
      {sponsorshipsLoading && (
        <Typography>{sponsorshipsTranslations("loading")}</Typography>
      )}
      {noSponsorships && <Typography></Typography>}
      {activeSponsorships && activeSponsorships?.length > 0 && (
        <List
          sx={[
            sectionStyles,
            {
              width: "100%",
              maxWidth: 500,
            },
          ]}
        >
          {activeSponsorships.map((sponsorship, idx) => (
            <SponsorshipDisplay
              type={myMember ? "for" : "from"}
              sponsorship={sponsorship}
              key={idx}
              handleCancelSponsorship={handleCancelSponsorship}
              showAmount={showAmount}
            />
          ))}
        </List>
      )}
    </Fragment>
  );
};

export default Sponsorships;
