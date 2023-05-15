import { Box, Stack, Divider, Button, CircularProgress } from "@mui/material";
import { User } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Section from "../../../common/components/section";
import { AppState } from "../../../common/context/appState";
import { memberConverter } from "../../../common/context/weverse";
import { CitySearchInput } from "../input";
import SummaryInput from "../input/SummaryInput";
import {
  useFormData,
  PosiFormData,
  WorkingCopyPosiFormData,
  posiFormData,
  PosiFormContext,
  PosiFormDispatchContext,
} from "../input/context";
import ImpactedPersonsInput from "../input/impactedPersonsInput";
import ImpactMediaInput from "../input/impactMediaInput";

const GetMaker = ({ appState, user }: { appState: AppState; user: User }) => {
  const [formData, setFormData] = useFormData();
  const memberDocRef = doc(
    appState.firestore,
    "members",
    user.uid
  ).withConverter(memberConverter);
  const [member, loading, error] = useDocumentData(memberDocRef);

  useEffect(() => {
    if (member && setFormData) {
      setFormData((fD) => ({ ...fD, makerId: member.makerId }));
    }
  }, [member, setFormData]);

  return <></>;
};

const PosiForm = ({
  appState,
  user,
  onSubmit,
  initialPosi = {},
}: {
  appState: AppState;
  user: User | null;
  onSubmit: (posiFormData: PosiFormData) => Promise<void>;
  initialPosi?: WorkingCopyPosiFormData;
}) => {
  const [formData, setFormData] =
    useState<WorkingCopyPosiFormData>(initialPosi);
  const [uploading, setUploading] = useState(false);

  return (
    <Box>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setUploading(true);
          console.log(formData);
          const checkedPosiFormData = posiFormData.parse(formData);
          await onSubmit(checkedPosiFormData);
        }}
      >
        <PosiFormContext.Provider value={formData}>
          <PosiFormDispatchContext.Provider value={setFormData}>
            {user && appState && <GetMaker appState={appState} user={user} />}
            <Stack
              spacing={2}
              margin={2}
              divider={<Divider flexItem />}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Section label="Muéstranos un poco de lo que has hecho">
                <ImpactMediaInput />
              </Section>
              <Section label="Describe tu acción">
                <SummaryInput />
              </Section>
              <Section label="¿A quiénes ayudaste?">
                <ImpactedPersonsInput />
              </Section>
              <Section label="¿Dónde realizaste esta acción?">
                <CitySearchInput />
              </Section>
              {uploading || formData.media == "loading" ? (
                <CircularProgress />
              ) : (
                <Button variant="contained" sx={{ mt: 3 }} type="submit">
                  Publicar
                </Button>
              )}
            </Stack>
          </PosiFormDispatchContext.Provider>
        </PosiFormContext.Provider>
      </form>
    </Box>
  );
};

export default PosiForm;
