import { Box, Stack, Divider, Button, CircularProgress } from "@mui/material";
import { useEffect, useState, FC, Fragment, useRef } from "react";
import Section from "../../../common/components/section";
import { CitySearchInput } from "../input";
import SummaryInput from "../input/SummaryInput";
import {
  WorkingCopyPosiFormData,
  PosiFormContext,
  PosiFormDispatchContext,
} from "../input/context";
import ImpactMediaInput from "../input/impactMediaInput";
import {
  Locale,
  PosiFormData,
  locale,
  posiFormData,
} from "../../../functions/shared/src";
import { useMyInitiative } from "../../../common/context/weverseUtils";
import ValidatorInput from "../input/validatorInput";
import { useTranslations } from "next-intl";
import { sectionStyles } from "../../../common/components/theme";
import AddInternationalizedDetailedInput, {
  DetailedInputProps,
} from "../../../common/components/addInternationalizedDetailedInput";
import { Locale2Messages } from "../../../common/utils/translations";

type onInteractionProp =
  | { type: "create"; onSubmit: (posiFormData: PosiFormData) => Promise<void> }
  | {
      type: "update";
      onUpdate: (posiFormData: PosiFormData) => Promise<void>;
      onDelete: () => Promise<void>;
    };

const DetailedInput: FC<DetailedInputProps<WorkingCopyPosiFormData>> = (
  props: DetailedInputProps<WorkingCopyPosiFormData>
) => {
  const t = useTranslations("actions.upload");
  return (
    <Stack sx={sectionStyles}>
      <Section label={t("sections.media.title")}>
        <ImpactMediaInput {...props} />
      </Section>
      <Section label={t("sections.summary.title")}>
        <SummaryInput {...props} />
      </Section>
    </Stack>
  );
};

const PosiForm = ({
  onInteraction,
  initialPosi = {},
  locale2Messages,
}: {
  onInteraction: onInteractionProp;
  initialPosi?: WorkingCopyPosiFormData;
  locale2Messages: Locale2Messages;
}) => {
  const [formData, setFormData] =
    useState<WorkingCopyPosiFormData>(initialPosi);
  const [uploading, setUploading] = useState(false);

  const [myInitiative] = useMyInitiative();
  useEffect(() => {
    if (myInitiative && setFormData) {
      setFormData((fD) => ({ ...fD, initiativeId: myInitiative.id }));
    }
  }, [myInitiative, setFormData]);
  const callToActionTranslations = useTranslations("common.callToAction");

  const t = useTranslations("actions.upload");
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
        <Fragment>
          <PosiFormContext.Provider value={formData}>
            <PosiFormDispatchContext.Provider value={setFormData}>
              <Stack
                spacing={2}
                margin={2}
                divider={<Divider flexItem />}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Box sx={sectionStyles}>
                  <Section label={t("sections.location.title")}>
                    <CitySearchInput />
                  </Section>
                </Box>
                <DetailedInput
                  setVal={setFormData}
                  val={formData}
                  locale={formData.locale!}
                />
                <AddInternationalizedDetailedInput
                  val={formData}
                  setVal={setFormData}
                  locale2Messages={locale2Messages}
                  detailedInput={DetailedInput}
                />
                {myInitiative && myInitiative.incubator && (
                  <Section label={t("sections.validator.title")}>
                    <ValidatorInput incubator={myInitiative.incubator} />
                  </Section>
                )}
                {uploading ||
                !!Object.keys(locale.Enum).find(
                  (l) =>
                    formData[l as Locale] &&
                    formData[l as Locale]?.media == "loading"
                ) ? (
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
        </Fragment>
      </form>
    </Box>
  );
};

export default PosiForm;
