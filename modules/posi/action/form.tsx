import { Box, Stack, Divider, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Section from "../../../common/components/section";
import { CitySearchInput } from "../input";
import SummaryInput from "../input/SummaryInput";
import {
  WorkingCopyPosiFormData,
  PosiFormContext,
  PosiFormDispatchContext,
} from "../input/context";
import ImpactedPersonsInput from "../input/impactedPersonsInput";
import ImpactMediaInput from "../input/impactMediaInput";
import { PosiFormData, posiFormData } from "../../../functions/shared/src";
import { useMyMaker } from "../../../common/context/weverseUtils";
import ValidatorInput from "../input/validatorInput";
import { useTranslations } from "next-intl";

type onInteractionProp =
  | { type: "create"; onSubmit: (posiFormData: PosiFormData) => Promise<void> }
  | {
      type: "update";
      onUpdate: (posiFormData: PosiFormData) => Promise<void>;
      onDelete: () => Promise<void>;
    };

const PosiForm = ({
  onInteraction,
  initialPosi = {},
}: {
  onInteraction: onInteractionProp;
  initialPosi?: WorkingCopyPosiFormData;
}) => {
  const [formData, setFormData] =
    useState<WorkingCopyPosiFormData>(initialPosi);
  const [uploading, setUploading] = useState(false);

  const [myMaker] = useMyMaker();
  useEffect(() => {
    if (myMaker && setFormData) {
      setFormData((fD) => ({ ...fD, makerId: myMaker.id }));
    }
  }, [myMaker, setFormData]);
  const t = useTranslations("actions.upload");
  const callToActionTranslations = useTranslations("common.callToAction");

  return (
    <Box>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setUploading(true);
          const checkedPosiFormData = posiFormData.parse(formData);
          if (onInteraction.type == "create") {
            await onInteraction.onSubmit(checkedPosiFormData);
          } else {
            await onInteraction.onUpdate(checkedPosiFormData);
          }
        }}
      >
        <PosiFormContext.Provider value={formData}>
          <PosiFormDispatchContext.Provider value={setFormData}>
            <Stack
              spacing={2}
              margin={2}
              divider={<Divider flexItem />}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Section label={t("sections.media.title")}>
                <ImpactMediaInput />
              </Section>
              <Section label={t("sections.summary.title")}>
                <SummaryInput />
              </Section>
              <Section label={t("sections.impactedPersons.title")}>
                <ImpactedPersonsInput />
              </Section>
              <Section label={t("sections.location.title")}>
                <CitySearchInput />
              </Section>
              {myMaker && myMaker.incubator && (
                <Section label="Trabajando con tu incubadora">
                  <ValidatorInput incubator={myMaker.incubator} />
                </Section>
              )}
              {uploading || formData.media == "loading" ? (
                <CircularProgress />
              ) : onInteraction.type == "create" ? (
                <Button variant="contained" sx={{ mt: 3 }} type="submit">
                  {t("submit")}
                </Button>
              ) : (
                <Stack direction={"row"} sx={{ mt: 3 }} spacing={1}>
                  <Button variant="outlined" onClick={onInteraction.onDelete}>
                    {callToActionTranslations("delete")}
                  </Button>
                  <Button variant="contained" type="submit">
                    {callToActionTranslations("update")}
                  </Button>
                </Stack>
              )}
            </Stack>
          </PosiFormDispatchContext.Provider>
        </PosiFormContext.Provider>
      </form>
    </Box>
  );
};

export default PosiForm;
