import { Close } from "@mui/icons-material";
import {
  ListItem,
  ListItemIcon,
  IconButton,
  ListItemText,
  Stack,
  Avatar,
  Typography,
  List,
  ListSubheader,
  CircularProgress,
} from "@mui/material";
import { useState, Fragment } from "react";
import {
  useMaker,
  useMember,
  useCurrentSponsorships,
  useCurrentMember,
} from "../../../common/context/weverseUtils";
import { Sponsorship } from "../../../functions/shared/src";
import { feePercentage, toDisplayCurrency, currencyInfo } from "./common/utils";
import { useTranslations } from "next-intl";

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
  const sponsorTranslations = useTranslations("common.sponsor");
  const sponsorshipLevelInfo = currencyInfo.cop.sponsorshipLevelInfo;
  const [maker] = useMaker(type == "for" ? sponsorship.maker : undefined);
  const [member] = useMember(type == "from" ? sponsorship.member : undefined);
  const [loading, setLoading] = useState(false);
  const displayInfo =
    type == "for"
      ? {
          name: maker?.name,
          pic: maker?.pic,
        }
      : {
          name: member?.name,
          pic: member?.pic,
        };
  const dateStarted = new Intl.DateTimeFormat("es-CO").format(
    sponsorship.paymentsStarted!
  );
  const amountReceivedFromMember =
    type == "for"
      ? undefined
      : (() => {
          const feeCharge = currencyInfo[sponsorship.currency].feeCharge.amount;
          const tipPercent = sponsorship.tipAmount / 100;
          const amountReceivedFromMemberIfFeePaidByMember =
            (sponsorship.total - feeCharge) / (1 + tipPercent + feePercentage);
          const amountReceivedFromMemberIfFeePaidByMaker =
            (sponsorship.total - feeCharge - feeCharge * tipPercent) /
            (1 + tipPercent + feePercentage + tipPercent * feePercentage);
          return sponsorship.denyFee
            ? amountReceivedFromMemberIfFeePaidByMaker
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
      <Typography variant="body2">
        {sponsorTranslations("levels." + sponsorship.sponsorshipLevel)}
      </Typography>
    </ListItem>
  );
};

const Sponsorships = ({
  handleCancelSponsorship,
  showAmount,
}: {
  handleCancelSponsorship?: (sponsorship: Sponsorship) => Promise<any>;
  showAmount?: boolean;
}) => {
  const [sponsorships, sponsorshipsLoading, sponsorshipsError] =
    useCurrentSponsorships();
  const [myMember] = useCurrentMember();
  <Typography variant="h2">Patrocinios:</Typography>;

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
      <Typography variant="h2">Patrocinios:</Typography>
      {sponsorshipsError && (
        <Typography color={"red"}>
          Error: {JSON.stringify(sponsorshipsError)}
        </Typography>
      )}
      {sponsorshipsLoading && <Typography>Patrocinios: Cargando...</Typography>}
      {noSponsorships && <Typography>No hay patrocinios.</Typography>}
      {activeSponsorships && activeSponsorships?.length > 0 && (
        <List
          subheader={
            myMember && (
              <ListSubheader>
                Ciclo de facturación iniciado:{" "}
                {new Intl.DateTimeFormat("es-CO").format(
                  myMember.stripe?.billingCycleAnchor
                )}
              </ListSubheader>
            )
          }
          sx={{
            border: 1,
            p: 2,
            m: 2,
            backgroundColor: "#f5f8ff",
            borderRadius: 2,
            borderColor: "#d9e1ec",
            width: "100%",
            maxWidth: 500,
          }}
        >
          {activeSponsorships.map((sponsorship) => (
            <SponsorshipDisplay
              type={myMember ? "for" : "from"}
              sponsorship={sponsorship}
              key={sponsorship.id}
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
