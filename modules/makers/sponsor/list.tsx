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
} from "@mui/material";
import { useState, Fragment } from "react";
import {
  useMaker,
  useMember,
  useCurrentSubscriptions,
  useCurrentMember,
} from "../../../common/context/weverseUtils";
import { Sponsorship } from "../../../functions/shared/src";
import {
  toCop,
  sponsorshipLevels,
  feeCharge,
  feePercentage,
} from "./common/utils";

const SponsorshipDisplay = ({
  sponsorship,
  type,
  handleDelete,
  showAmount,
}: {
  sponsorship: Sponsorship;
  type: "for" | "from";
  handleDelete?: (sponsorshipId: string) => Promise<any>;
  showAmount?: boolean;
}) => {
  const [maker] = useMaker(type == "for" ? sponsorship.maker : undefined);
  const [member] = useMember(type == "from" ? sponsorship.member : undefined);
  const [loading, setLoading] = useState(false);
  console.log("yo: ", {
    maker,
    member,
    type,
    sponsorship,
    for: type == "for" ? sponsorship.maker : undefined,
    from: type == "from" ? sponsorship.member : undefined,
  });
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
      ? toCop(amountReceivedFromMember)
      : toCop(sponsorship.total)
    : "";

  return (
    <ListItem>
      {type == "for" && handleDelete && (
        <ListItemIcon>
          <IconButton
            onClick={async () => {
              setLoading(true);
              await handleDelete(sponsorship.id!);
              setLoading(false);
            }}
          >
            <Close />
          </IconButton>
        </ListItemIcon>
      )}
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
        {sponsorshipLevels[sponsorship.sponsorshipLevel].displayName}
      </Typography>
    </ListItem>
  );
};

const Sponsorships = ({
  handleDelete,
  showAmount,
}: {
  handleDelete?: (sponsorshipId: string) => Promise<any>;
  showAmount?: boolean;
}) => {
  const [sponsorships, sponsorshipsLoading, sponsorshipsError] =
    useCurrentSubscriptions();
  const [myMember] = useCurrentMember();
  <Typography variant="h2">Patrocinios:</Typography>;
  const noSponsorships =
    !sponsorshipsLoading &&
    !sponsorshipsError &&
    sponsorships &&
    sponsorships.length == 0;

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
      {sponsorships && sponsorships?.length > 0 && (
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
          {sponsorships
            ?.filter((sponsorship) => !!sponsorship.paymentsStarted)
            .map((sponsorship) => (
              <SponsorshipDisplay
                type={myMember ? "for" : "from"}
                sponsorship={sponsorship}
                key={sponsorship.id}
                handleDelete={handleDelete}
                showAmount={showAmount}
              />
            ))}
        </List>
      )}
    </Fragment>
  );
};

export default Sponsorships;
