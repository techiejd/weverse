import { Dispatch, SetStateAction, useCallback } from "react";
import FileInput from "./fileInput";
import { useFormData } from "./context";
import { Box, Typography } from "@mui/material";
import { Locale, Media } from "../../../functions/shared/src";
import { useTranslations } from "next-intl";

const ImpactMediaInput = ({ locale }: { locale: Locale }) => {
  const [formData, setFormData] = useFormData();
  const presentationInfo = formData[locale];
  console.log(formData);
  console.log({ locale, setFormData });

  const updateMedia: Dispatch<SetStateAction<Media | undefined | "loading">> =
    useCallback(
      (newMediaOrFunc) => {
        if (setFormData) {
          setFormData((fD) => {
            const localizedInfo = fD[locale] || {};
            const media =
              typeof newMediaOrFunc == "function"
                ? newMediaOrFunc(localizedInfo.media)
                : newMediaOrFunc;
            console.log("fD", {
              ...fD,
              [locale]: { ...localizedInfo, media },
            });
            return {
              ...fD,
              [locale]: { ...localizedInfo, media },
            };
          });
        }
      },
      [locale, setFormData]
    );

  const t = useTranslations("actions.upload.sections.media");
  return (
    <Box>
      <Typography>{t("prompt")}</Typography>
      <FileInput
        initialMedia={
          presentationInfo?.media == "loading"
            ? undefined
            : presentationInfo?.media
        }
        setMedia={updateMedia}
        required={presentationInfo?.media ? false : true}
        maxFileSize={2147483648 /** 2GB */}
        accept={"both"}
        metadata={{ impactId: "" }}
      />
    </Box>
  );
};

export default ImpactMediaInput;
