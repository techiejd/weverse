import {
  FormControl,
  IconButton,
  InputLabel,
  NativeSelect,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import { useCurrentMaker } from "../../../../modules/makers/context";
import { LoadingButton } from "@mui/lab";
import { doc, writeBatch } from "firebase/firestore";
import { useAppState } from "../../../../common/context/appState";
import {
  incubateeConverter,
  makerConverter,
} from "../../../../common/utils/firebase";
import { v4 } from "uuid";
import {
  organizationType,
  makerType as makerTypeSchema,
  MakerType,
  OrganizationType,
} from "../../../../functions/shared/src";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import buildUrl from "@googlicius/build-url";
import { WithTranslationsStaticProps } from "../../../../common/utils/translations";
import { CachePaths } from "../../../../common/utils/staticPaths";
import { asOneWePage } from "../../../../common/components/onewePage";
import { useTranslations } from "next-intl";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const Invite = asOneWePage(() => {
  const appState = useAppState();
  const [maker] = useCurrentMaker();
  const [loading, setLoading] = useState(false);
  const [invitedAsMakers, setInvitedAsMakers] = useState([v4()]);

  const [makerTypes, setMakerTypes] = useState<
    (MakerType | OrganizationType)[]
  >(["nonprofit" as OrganizationType]);
  const [makerNames, setMakerNames] = useState([""]);

  const inviteTranslations = useTranslations("makers.invite");

  const InviteMakerInput = ({ index }: { index: number }) => {
    const inviteTranslations = useTranslations("makers.invite");
    const makerTypesTranslations = useTranslations("makers.types");
    const makeTypeOption = (t: MakerType | OrganizationType) => {
      const translateType = (t: MakerType | OrganizationType) =>
        makerTypesTranslations("long." + t);
      return <option value={t}>{translateType(t)}</option>;
    };
    //TODO(techiejd): React's not updating the states through array manipulation.
    const [makerName, setMakerName] = useState(makerNames[index] ?? "");
    const [makerType, setMakerType] = useState(
      makerTypes[index] ?? organizationType.Enum.nonprofit
    );
    const onSelectMakerType = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setMakerType(event.target.value as MakerType | OrganizationType);
      setMakerTypes((makerTypes) =>
        makerTypes.map((type, i) =>
          i === index
            ? (event.target.value as MakerType | OrganizationType)
            : type
        )
      );
    };
    return (
      <Fragment>
        <FormControl fullWidth sx={{ maxWidth: 600 }}>
          <InputLabel htmlFor="makerType">
            {makerTypesTranslations("title")}
          </InputLabel>
          <NativeSelect
            sx={{ width: "100%" }}
            value={makerType}
            onChange={onSelectMakerType}
            inputProps={{
              name: "makerType",
              id: "makerType",
            }}
          >
            {makeTypeOption(makerTypeSchema.Enum.individual)}
            {makeTypeOption(organizationType.Enum.nonprofit)}
            {makeTypeOption(organizationType.Enum.religious)}
            {makeTypeOption(organizationType.Enum.unincorporated)}
            {makeTypeOption(organizationType.Enum.profit)}
          </NativeSelect>
        </FormControl>
        <TextField
          required
          label={inviteTranslations("whatIsMakersName", {
            makerType: makerTypes[index],
          })}
          margin="normal"
          inputProps={{ maxLength: 75 }}
          fullWidth
          sx={{ maxWidth: 600 }}
          value={makerName}
          onChange={(e) => {
            setMakerName(e.target.value);
            setMakerNames((makerNames) => {
              return makerNames.map((name, i) => {
                return i === index ? e.target.value : name;
              });
            });
          }}
        />
      </Fragment>
    );
  };

  const [inviteMakerInputs, setInviteMakerInputs] = useState<JSX.Element[]>([
    <InviteMakerInput key={0} index={0} />,
  ]);

  return (
    <Stack
      sx={{ justifyContent: "center", alignItems: "center", pt: 2, px: 2 }}
      spacing={4}
    >
      <Typography variant="h2" textAlign="center">
        {inviteTranslations("title")}
      </Typography>
      {inviteMakerInputs}
      <Stack direction="row" spacing={2}>
        <IconButton
          disabled={inviteMakerInputs.length <= 1}
          onClick={() => {
            setMakerNames((makerNames) => makerNames.slice(0, -1));
            setMakerTypes((makerTypes) => makerTypes.slice(0, -1));
            setInviteMakerInputs((inviteMakerInputs) =>
              inviteMakerInputs.slice(0, -1)
            );
            setInvitedAsMakers((invitedAsMakers) =>
              invitedAsMakers.slice(0, -1)
            );
          }}
        >
          <Remove />
        </IconButton>
        <IconButton
          onClick={() => {
            //TODO(techiejd): Look into consolidating this in order to avoid race conditions.
            setMakerNames((makerNames) => [...makerNames, ""]);
            setInvitedAsMakers((invitedAsMakers) => [...invitedAsMakers, v4()]);
            setMakerTypes((makerTypes) => [...makerTypes, "nonprofit"]);
            setInviteMakerInputs((inviteMakerInputs) => [
              ...inviteMakerInputs,
              <InviteMakerInput
                key={inviteMakerInputs.length}
                index={inviteMakerInputs.length}
              />,
            ]);
          }}
        >
          <Add />
        </IconButton>
      </Stack>
      <LoadingButton
        variant="contained"
        sx={{ width: "fit-content" }}
        disabled={
          !makerNames.every((makerName) => makerName) || loading || !maker
        }
        loading={loading}
        href={
          maker
            ? buildUrl(`/makers/${maker.id!}/invite/share`, {
                queryParams: {
                  makerNames,
                  inviter: maker.id!,
                  invitedAsMakers,
                  registerRequested: true,
                },
              })
            : undefined
        }
        onClick={async () => {
          setLoading(true);
          if (!maker) return false;
          const batch = writeBatch(appState.firestore);
          invitedAsMakers.forEach((invitedAsMaker, idx) => {
            const incubateeMakerDocRef = doc(
              appState.firestore,
              "makers",
              invitedAsMaker
            ).withConverter(makerConverter);
            batch.set(incubateeMakerDocRef, {
              ownerId: "invited",
              type:
                makerTypes[idx] == "individual" ? "individual" : "organization",
              organizationType:
                makerTypes[idx] == "individual"
                  ? undefined
                  : organizationType.parse(makerTypes[idx]),
              name: makerNames[idx],
              incubator: maker?.id,
            });
            const incubateeDocRef = doc(
              appState.firestore,
              "makers",
              maker.id!,
              "incubatees",
              invitedAsMaker
            ).withConverter(incubateeConverter);
            batch.set(incubateeDocRef, {
              acceptedInvite: false,
            });
          });
          await batch.commit();
          setLoading(false);
        }}
      >
        {inviteTranslations("makeLink")}
      </LoadingButton>
    </Stack>
  );
});

export default Invite;
