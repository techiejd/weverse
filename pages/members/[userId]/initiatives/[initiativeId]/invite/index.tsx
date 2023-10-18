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
import { LoadingButton } from "@mui/lab";
import { doc, writeBatch } from "firebase/firestore";
import { v4 } from "uuid";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import buildUrl from "@googlicius/build-url";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../../../../../common/components/onewePage";
import { useAppState } from "../../../../../../common/context/appState";
import {
  useInitiativeConverter,
  useIncubateeConverter,
} from "../../../../../../common/utils/firebase";
import { CachePaths } from "../../../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../../../common/utils/translations";
import {
  InitiativeType,
  OrganizationType,
  organizationType,
  initiativeType as initiativeTypeSchema,
} from "../../../../../../functions/shared/src";
import { useCurrentInitiative } from "../../../../../../modules/initiatives/context";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const Invite = asOneWePage(() => {
  const appState = useAppState();
  const [initiative] = useCurrentInitiative();
  const [loading, setLoading] = useState(false);
  const [invitedInitiatives, setInvitedInitiatives] = useState([v4()]);
  const initiativeConverter = useInitiativeConverter();
  const incubateeConverter = useIncubateeConverter();

  const [initiativeTypes, setInitiativeTypes] = useState<
    (InitiativeType | OrganizationType)[]
  >(["nonprofit" as OrganizationType]);
  const [initiativeNames, setInitiativeNames] = useState([""]);

  const inviteTranslations = useTranslations("initiatives.invite");

  const InviteInitiativeInput = ({ index }: { index: number }) => {
    const inviteTranslations = useTranslations("initiatives.invite");
    const initiativeTypesTranslations = useTranslations("initiatives.types");
    const makeTypeOption = (t: InitiativeType | OrganizationType) => {
      const translateType = (t: InitiativeType | OrganizationType) =>
        initiativeTypesTranslations("long." + t);
      return <option value={t}>{translateType(t)}</option>;
    };
    //TODO(techiejd): React's not updating the states through array manipulation.
    const [initiativeName, setInitiativeName] = useState(
      initiativeNames[index] ?? ""
    );
    const [initiativeType, setInitiativeType] = useState(
      initiativeTypes[index] ?? organizationType.Enum.nonprofit
    );
    const onSelectInitiativeType = (
      event: React.ChangeEvent<HTMLSelectElement>
    ) => {
      setInitiativeType(
        event.target.value as InitiativeType | OrganizationType
      );
      setInitiativeTypes((initiativeTypes) =>
        initiativeTypes.map((type, i) =>
          i === index
            ? (event.target.value as InitiativeType | OrganizationType)
            : type
        )
      );
    };
    return (
      <Fragment>
        <FormControl fullWidth sx={{ maxWidth: 600 }}>
          <InputLabel htmlFor="initiativeType">
            {initiativeTypesTranslations("title")}
          </InputLabel>
          <NativeSelect
            sx={{ width: "100%" }}
            value={initiativeType}
            onChange={onSelectInitiativeType}
            inputProps={{
              name: "initiativeType",
              id: "initiativeType",
            }}
          >
            {makeTypeOption(initiativeTypeSchema.Enum.individual)}
            {makeTypeOption(organizationType.Enum.nonprofit)}
            {makeTypeOption(organizationType.Enum.religious)}
            {makeTypeOption(organizationType.Enum.unincorporated)}
            {makeTypeOption(organizationType.Enum.profit)}
          </NativeSelect>
        </FormControl>
        <TextField
          required
          label={inviteTranslations("whatIsInitiativesName", {
            initiativeType: initiativeTypes[index],
          })}
          margin="normal"
          inputProps={{ maxLength: 75 }}
          fullWidth
          sx={{ maxWidth: 600 }}
          value={initiativeName}
          onChange={(e) => {
            setInitiativeName(e.target.value);
            setInitiativeNames((initiativeNames) => {
              return initiativeNames.map((name, i) => {
                return i === index ? e.target.value : name;
              });
            });
          }}
        />
      </Fragment>
    );
  };

  const [inviteInitiativeInputs, setInviteInitiativeInputs] = useState<
    JSX.Element[]
  >([<InviteInitiativeInput key={0} index={0} />]);

  return (
    <Stack
      sx={{ justifyContent: "center", alignItems: "center", pt: 2, px: 2 }}
      spacing={4}
    >
      <Typography variant="h2" textAlign="center">
        {inviteTranslations("title")}
      </Typography>
      {inviteInitiativeInputs}
      <Stack direction="row" spacing={2}>
        <IconButton
          disabled={inviteInitiativeInputs.length <= 1}
          onClick={() => {
            setInitiativeNames((initiativeNames) =>
              initiativeNames.slice(0, -1)
            );
            setInitiativeTypes((initiativeTypes) =>
              initiativeTypes.slice(0, -1)
            );
            setInviteInitiativeInputs((inviteInitiativeInputs) =>
              inviteInitiativeInputs.slice(0, -1)
            );
            setInvitedInitiatives((invitedInitiatives) =>
              invitedInitiatives.slice(0, -1)
            );
          }}
        >
          <Remove />
        </IconButton>
        <IconButton
          onClick={() => {
            //TODO(techiejd): Look into consolidating this in order to avoid race conditions.
            setInitiativeNames((initiativeNames) => [...initiativeNames, ""]);
            setInvitedInitiatives((invitedInitiatives) => [
              ...invitedInitiatives,
              v4(),
            ]);
            setInitiativeTypes((initiativeTypes) => [
              ...initiativeTypes,
              "nonprofit",
            ]);
            setInviteInitiativeInputs((inviteInitiativeInputs) => [
              ...inviteInitiativeInputs,
              <InviteInitiativeInput
                key={inviteInitiativeInputs.length}
                index={inviteInitiativeInputs.length}
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
          !initiativeNames.every((initiativeName) => initiativeName) ||
          loading ||
          !initiative
        }
        loading={loading}
        href={
          initiative
            ? buildUrl(`${initiative.path!}/invite/share`, {
                queryParams: {
                  initiativeNames,
                  inviter: initiative.path,
                  invitedInitiatives,
                  registerRequested: true,
                },
              })
            : undefined
        }
        onClick={async () => {
          setLoading(true);
          if (!initiative) return false;
          const batch = writeBatch(appState.firestore);
          invitedInitiatives.forEach((invitedInitiative, idx) => {
            const incubateeInitiativeDocRef = doc(
              appState.firestore,
              "initiatives",
              invitedInitiative
            ).withConverter(initiativeConverter);
            batch.set(incubateeInitiativeDocRef, {
              type:
                initiativeTypes[idx] == "individual"
                  ? "individual"
                  : "organization",
              organizationType:
                initiativeTypes[idx] == "individual"
                  ? undefined
                  : organizationType.parse(initiativeTypes[idx]),
              name: initiativeNames[idx],
              incubator: initiative?.path,
            });
            const incubateeDocRef = doc(
              appState.firestore,
              initiative.path!,
              "incubatees",
              invitedInitiative
            ).withConverter(incubateeConverter);
            batch.set(incubateeDocRef, {});
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
